from decimal import Decimal

from django.db.models import Q

from cards.models import Card
from transactions.models import Transaction
from wallets.models import Wallet


def get_alerts_summary(user):
    alerts = []
    restaurant_spend = sum(
        transaction.amount
        for transaction in Transaction.objects.filter(
            user=user,
            kind=Transaction.TransactionKind.EXPENSE,
        ).filter(Q(category="Restaurante") | Q(expense_category__name="Restaurante"))
    )
    restaurant_budget = Decimal("1300.00")
    if restaurant_spend > restaurant_budget:
        percent = int((restaurant_spend / restaurant_budget) * 100)
        alerts.append(
            {
                "type": "warning",
                "title": "Restaurante acima do limite",
                "description": f"Voce ja gastou {percent}% da verba de lazer.",
                "icon_key": "warning",
            }
        )

    credit_card = (
        Card.objects.filter(user=user, card_kind=Card.CardKind.CREDIT)
        .order_by("display_order", "name")
        .first()
    )
    if credit_card and credit_card.total_limit > 0:
        percent = int((credit_card.monthly_spend / credit_card.total_limit) * 100)
        alerts.append(
            {
                "type": "card",
                "title": f"Voce ja gastou {percent}% no cartao",
                "description": "Faltam 12 dias para o fechamento da fatura.",
                "icon_key": "credit_card",
            }
        )

    benefit_wallet = Wallet.objects.filter(
        user=user,
        wallet_type=Wallet.WalletType.BENEFIT,
    ).first()
    if benefit_wallet:
        alerts.append(
            {
                "type": "benefit",
                "title": "Caju esta acabando",
                "description": (
                    "Saldo de beneficios resta apenas "
                    f"R$ {benefit_wallet.balance:.2f}."
                ),
                "icon_key": "shopping_cart",
            }
        )

    return alerts


def get_dashboard_summary(user):
    from cards.selectors import get_cards_summary
    from debts.selectors import get_debt_summary
    from goals.selectors import get_goals_summary
    from transactions.selectors import get_filtered_transactions
    from wallets.selectors import get_wallet_summary

    wallet_summary = get_wallet_summary(user)
    goal_summary = get_goals_summary(user)
    debt_summary = get_debt_summary(user)
    card_summary = get_cards_summary(user)
    transactions = list(get_filtered_transactions(user)[:5])

    income_total = Decimal("0.00")
    expense_total = Decimal("0.00")
    for transaction in Transaction.objects.filter(user=user):
        if transaction.kind == Transaction.TransactionKind.INCOME:
            income_total += transaction.amount
        elif transaction.kind == Transaction.TransactionKind.EXPENSE:
            expense_total += transaction.amount

    net_balance = income_total - expense_total
    budget_total = sum(
        wallet.monthly_budget for wallet in Wallet.objects.filter(user=user)
    )
    budget_progress = Decimal("0.00")
    remaining_budget = Decimal("0.00")
    if budget_total > 0:
        budget_progress = (expense_total / budget_total) * Decimal("100")
        remaining_budget = max(budget_total - expense_total, Decimal("0.00"))

    total_balance = Decimal(wallet_summary["total_balance"])
    return {
        "header": {
            "display_name": user.first_name or user.username,
            "current_balance": str(total_balance.quantize(Decimal("0.01"))),
            "status_label": "No azul" if total_balance >= 0 else "No vermelho",
        },
        "monthly_summary": {
            "income": str(income_total.quantize(Decimal("0.01"))),
            "expenses": str(expense_total.quantize(Decimal("0.01"))),
            "net_balance": str(net_balance.quantize(Decimal("0.01"))),
            "budget_progress_percent": str(budget_progress.quantize(Decimal("0.01"))),
            "variable_budget_remaining": str(
                remaining_budget.quantize(Decimal("0.01"))
            ),
        },
        "reserve_goal": {
            "title": goal_summary["title"],
            "monthly_target": goal_summary["monthly_target"],
            "progress_percent": goal_summary["progress_percent"],
            "missing_amount": goal_summary["missing_amount"],
        },
        "debt_summary": {
            "strategy_name": debt_summary["strategy_name"],
            "payoff_month": debt_summary["payoff_month"],
            "total_remaining": debt_summary["total_remaining"],
            "monthly_payment": debt_summary["monthly_payment"],
        },
        "alerts": get_alerts_summary(user),
        "benefit_card": card_summary["benefit_card"],
        "transactions_preview": transactions,
    }
