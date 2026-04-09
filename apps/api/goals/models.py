from decimal import Decimal

from django.conf import settings
from django.db import models


class Goal(models.Model):
    class GoalType(models.TextChoices):
        RESERVE = "reserve", "Reserve"
        SAVINGS = "savings", "Savings"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="goals",
    )
    name = models.CharField(max_length=120)
    goal_type = models.CharField(max_length=20, choices=GoalType.choices)
    target_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    current_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    monthly_target = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    display_order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("display_order", "name")

    def __str__(self):
        return self.name
