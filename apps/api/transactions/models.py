from decimal import Decimal

from django.conf import settings
from django.db import models

from cards.models import Card
from categories.models import Category
from wallets.models import Wallet


class Transaction(models.Model):
    class TransactionKind(models.TextChoices):
        INCOME = "income", "Income"
        EXPENSE = "expense", "Expense"
        TRANSFER = "transfer", "Transfer"

    class PaymentMethod(models.TextChoices):
        BENEFIT = "benefit", "Benefit"
        CREDIT = "credit", "Credit"
        DEBIT = "debit", "Debit"
        PIX = "pix", "Pix"

    class ExpenseType(models.TextChoices):
        ESSENTIAL = "essential", "Essential"
        NON_ESSENTIAL = "non_essential", "Non essential"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions",
    )
    wallet = models.ForeignKey(
        Wallet,
        on_delete=models.CASCADE,
        related_name="transactions",
        null=True,
        blank=True,
    )
    card = models.ForeignKey(
        Card,
        on_delete=models.CASCADE,
        related_name="transactions",
        null=True,
        blank=True,
    )
    expense_category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name="transactions",
        null=True,
        blank=True,
    )
    title = models.CharField(max_length=140)
    category = models.CharField(max_length=80)
    kind = models.CharField(max_length=20, choices=TransactionKind.choices)
    payment_method = models.CharField(
        max_length=20, choices=PaymentMethod.choices, blank=True
    )
    expense_type = models.CharField(
        max_length=20, choices=ExpenseType.choices, blank=True
    )
    is_installment = models.BooleanField(default=False)
    installment_count = models.PositiveSmallIntegerField(default=1)
    amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    notes = models.TextField(blank=True)
    occurred_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-occurred_at", "-id")

    def __str__(self):
        return self.title
