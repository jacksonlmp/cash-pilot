from decimal import Decimal

from django.conf import settings
from django.db import models


class Card(models.Model):
    class CardKind(models.TextChoices):
        BENEFIT = "benefit", "Benefit"
        CREDIT = "credit", "Credit"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cards",
    )
    name = models.CharField(max_length=120)
    card_kind = models.CharField(max_length=20, choices=CardKind.choices)
    holder_name = models.CharField(max_length=120)
    brand = models.CharField(max_length=40)
    last_four = models.CharField(max_length=4)
    current_balance = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    monthly_spend = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    total_limit = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    closing_day = models.PositiveSmallIntegerField(default=1)
    display_order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("display_order", "name")

    def __str__(self):
        return self.name
