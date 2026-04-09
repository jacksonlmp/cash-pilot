from decimal import Decimal

from django.conf import settings
from django.db import models


class Debt(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="debts",
    )
    title = models.CharField(max_length=140)
    strategy_name = models.CharField(max_length=80, default="Bola de Neve")
    total_remaining = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    monthly_payment = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    payoff_date = models.DateField()
    display_order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("display_order", "payoff_date")

    def __str__(self):
        return self.title
