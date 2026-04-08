from decimal import Decimal

from django.db import transaction as db_transaction

from cards.models import Card
from transactions.models import Transaction
from wallets.models import Wallet


@db_transaction.atomic
def register_transaction(
    *,
    user,
    wallet: Wallet | None,
    card: Card | None,
    expense_category,
    title,
    category,
    kind,
    amount,
    occurred_at,
    payment_method="",
    expense_type="",
    is_installment=False,
    installment_count=1,
):
    amount_decimal = Decimal(str(amount))
    transaction = Transaction.objects.create(
        user=user,
        wallet=wallet,
        card=card,
        expense_category=expense_category,
        title=title,
        category=category,
        kind=kind,
        payment_method=payment_method,
        expense_type=expense_type,
        is_installment=is_installment,
        installment_count=installment_count,
        amount=amount_decimal,
        occurred_at=occurred_at,
    )

    if kind == Transaction.TransactionKind.INCOME:
        if wallet is None:
            raise ValueError("Income transactions require a wallet.")
        wallet.balance += amount_decimal
        wallet.save(update_fields=["balance", "updated_at"])
    elif kind == Transaction.TransactionKind.EXPENSE and payment_method == Transaction.PaymentMethod.CREDIT:
        if card is None:
            raise ValueError("Credit expenses require a card.")
        card.monthly_spend += amount_decimal
        card.current_balance += amount_decimal
        card.save(update_fields=["monthly_spend", "current_balance", "updated_at"])
    elif kind == Transaction.TransactionKind.EXPENSE:
        if wallet is None:
            raise ValueError("Expense transactions require a wallet unless paid by credit.")
        wallet.balance -= amount_decimal
        wallet.save(update_fields=["balance", "updated_at"])
    return transaction
