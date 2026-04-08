from decimal import Decimal

from django.conf import settings
from django.db import models


class Wallet(models.Model):
    class WalletType(models.TextChoices):
        CASH = "cash", "Cash"
        BANK = "bank", "Bank"
        BENEFIT = "benefit", "Benefit"
        RESERVE = "reserve", "Reserve"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="wallets",
    )
    name = models.CharField(max_length=120)
    wallet_type = models.CharField(max_length=20, choices=WalletType.choices)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    monthly_budget = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    display_order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("display_order", "name")

    def __str__(self):
        return self.name
