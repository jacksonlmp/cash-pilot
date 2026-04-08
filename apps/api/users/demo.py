from datetime import date, datetime, timedelta
from decimal import Decimal

from django.utils import timezone

from cards.models import Card
from categories.models import Category
from debts.models import Debt
from goals.models import Goal
from transactions.models import Transaction
from wallets.models import Wallet


def seed_demo_data(user):
    expense_categories = [
        "Lazer",
        "Alimentação",
        "Transporte",
        "Saúde",
        "Moradia",
        "Casa",
    ]
    for index, category_name in enumerate(expense_categories, start=1):
        Category.objects.get_or_create(
            name=category_name,
            defaults={
                "category_kind": Category.CategoryKind.EXPENSE,
                "display_order": index,
            },
        )

    primary_wallet = Wallet.objects.create(
        user=user,
        name="Conta Principal",
        wallet_type=Wallet.WalletType.BANK,
        balance=Decimal("142850.42"),
        monthly_budget=Decimal("7480.00"),
        display_order=1,
    )
    Wallet.objects.create(
        user=user,
        name="Reserva de Emergencia",
        wallet_type=Wallet.WalletType.RESERVE,
        balance=Decimal("7200.00"),
        monthly_budget=Decimal("0.00"),
        display_order=2,
    )
    Wallet.objects.create(
        user=user,
        name="Caju Beneficios",
        wallet_type=Wallet.WalletType.BENEFIT,
        balance=Decimal("45.20"),
        monthly_budget=Decimal("0.00"),
        display_order=3,
    )

    base_datetime = timezone.make_aware(datetime(2026, 4, 7, 10, 0, 0))
    expense_category_map = {
        category.name: category
        for category in Category.objects.filter(category_kind=Category.CategoryKind.EXPENSE)
    }
    transactions = [
        ("Salario principal", "Salário", Transaction.TransactionKind.INCOME, Decimal("8400.00"), None, None, False, 1),
        ("Freela dashboard", "Extra", Transaction.TransactionKind.INCOME, Decimal("4000.00"), None, None, False, 1),
        ("Aluguel", "Moradia", Transaction.TransactionKind.EXPENSE, Decimal("2350.00"), Transaction.PaymentMethod.PIX, Transaction.ExpenseType.ESSENTIAL, False, 1),
        ("Mercado do mês", "Casa", Transaction.TransactionKind.EXPENSE, Decimal("975.00"), Transaction.PaymentMethod.DEBIT, Transaction.ExpenseType.ESSENTIAL, False, 1),
        ("Jantar com amigos", "Lazer", Transaction.TransactionKind.EXPENSE, Decimal("1495.00"), Transaction.PaymentMethod.CREDIT, Transaction.ExpenseType.NON_ESSENTIAL, True, 5),
    ]
    benefit_wallet = Wallet.objects.get(user=user, wallet_type=Wallet.WalletType.BENEFIT)
    credit_card = Card.objects.create(
        user=user,
        name="Cartao Principal",
        card_kind=Card.CardKind.CREDIT,
        holder_name="Jackson Silva",
        brand="Visa",
        last_four="1458",
        current_balance=Decimal("2520.00"),
        monthly_spend=Decimal("2520.00"),
        total_limit=Decimal("6000.00"),
        closing_day=19,
        display_order=2,
    )

    for index, (title, category, kind, amount, payment_method, expense_type, is_installment, installment_count) in enumerate(transactions):
        wallet = primary_wallet
        card = None
        expense_category = None
        if kind == Transaction.TransactionKind.EXPENSE:
            expense_category = expense_category_map[category]
            if payment_method == Transaction.PaymentMethod.BENEFIT:
                wallet = benefit_wallet
            elif payment_method == Transaction.PaymentMethod.CREDIT:
                wallet = None
                card = credit_card
        Transaction.objects.create(
            user=user,
            wallet=wallet,
            card=card,
            expense_category=expense_category,
            title=title,
            category=category,
            kind=kind,
            payment_method=payment_method or "",
            expense_type=expense_type or "",
            is_installment=is_installment,
            installment_count=installment_count,
            amount=amount,
            occurred_at=base_datetime - timedelta(days=index),
        )

    Goal.objects.create(
        user=user,
        name="Meta: Reserva",
        goal_type=Goal.GoalType.RESERVE,
        target_amount=Decimal("200.00"),
        current_amount=Decimal("120.00"),
        monthly_target=Decimal("200.00"),
        display_order=1,
    )

    Debt.objects.create(
        user=user,
        title="Plano de Quitacao Principal",
        strategy_name="Bola de Neve",
        total_remaining=Decimal("24100.00"),
        monthly_payment=Decimal("1250.00"),
        payoff_date=date(2026, 7, 1),
        display_order=1,
    )

    Card.objects.create(
        user=user,
        name="Cartao MultiBeneficios",
        card_kind=Card.CardKind.BENEFIT,
        holder_name="Jackson Silva",
        brand="Caju",
        last_four="4492",
        current_balance=Decimal("1420.00"),
        monthly_spend=Decimal("850.00"),
        total_limit=Decimal("2270.00"),
        closing_day=30,
        display_order=1,
    )
