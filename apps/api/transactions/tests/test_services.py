from decimal import Decimal

import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone

from cards.models import Card
from categories.models import Category
from transactions.models import Transaction
from transactions.services import register_transaction
from wallets.models import Wallet


@pytest.mark.django_db
def test_register_transaction_updates_wallet_balance_for_income():
    user = get_user_model().objects.create_user(username="tester")
    wallet = Wallet.objects.create(
        user=user,
        name="Conta",
        wallet_type=Wallet.WalletType.BANK,
        balance=Decimal("100.00"),
        monthly_budget=Decimal("0.00"),
    )

    register_transaction(
        user=user,
        wallet=wallet,
        card=None,
        expense_category=None,
        title="Salario",
        category="Receita",
        kind=Transaction.TransactionKind.INCOME,
        amount=Decimal("50.00"),
        occurred_at=timezone.now(),
    )

    wallet.refresh_from_db()
    assert wallet.balance == Decimal("150.00")


@pytest.mark.django_db
def test_register_transaction_updates_wallet_balance_for_expense():
    user = get_user_model().objects.create_user(username="tester2")
    expense_category = Category.objects.create(
        name="Casa",
        category_kind=Category.CategoryKind.EXPENSE,
        display_order=1,
    )
    wallet = Wallet.objects.create(
        user=user,
        name="Conta",
        wallet_type=Wallet.WalletType.BANK,
        balance=Decimal("100.00"),
        monthly_budget=Decimal("0.00"),
    )

    register_transaction(
        user=user,
        wallet=wallet,
        card=None,
        expense_category=expense_category,
        title="Mercado",
        category="Casa",
        kind=Transaction.TransactionKind.EXPENSE,
        payment_method=Transaction.PaymentMethod.DEBIT,
        expense_type=Transaction.ExpenseType.ESSENTIAL,
        amount=Decimal("40.00"),
        occurred_at=timezone.now(),
    )

    wallet.refresh_from_db()
    assert wallet.balance == Decimal("60.00")


@pytest.mark.django_db
def test_register_transaction_updates_credit_card_for_credit_expense():
    user = get_user_model().objects.create_user(username="tester3")
    expense_category = Category.objects.create(
        name="Lazer",
        category_kind=Category.CategoryKind.EXPENSE,
        display_order=1,
    )
    card = Card.objects.create(
        user=user,
        name="Nubank",
        card_kind=Card.CardKind.CREDIT,
        holder_name="Tester",
        brand="Mastercard",
        last_four="1234",
        current_balance=Decimal("100.00"),
        monthly_spend=Decimal("80.00"),
        total_limit=Decimal("1000.00"),
        closing_day=10,
        display_order=1,
    )

    register_transaction(
        user=user,
        wallet=None,
        card=card,
        expense_category=expense_category,
        title="Cinema",
        category="Lazer",
        kind=Transaction.TransactionKind.EXPENSE,
        payment_method=Transaction.PaymentMethod.CREDIT,
        expense_type=Transaction.ExpenseType.NON_ESSENTIAL,
        is_installment=True,
        installment_count=5,
        amount=Decimal("40.00"),
        occurred_at=timezone.now(),
    )

    card.refresh_from_db()
    assert card.current_balance == Decimal("140.00")
    assert card.monthly_spend == Decimal("120.00")
