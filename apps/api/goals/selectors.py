from decimal import Decimal

from goals.models import Goal


def get_goals_summary(user):
    goals = list(Goal.objects.filter(user=user).order_by("display_order", "name"))
    primary = goals[0] if goals else None
    progress_percent = Decimal("0.00")
    missing_amount = Decimal("0.00")
    if primary and primary.monthly_target > 0:
        progress_percent = (primary.current_amount / primary.monthly_target) * Decimal("100")
        missing_amount = max(primary.monthly_target - primary.current_amount, Decimal("0.00"))
    return {
        "title": primary.name if primary else "Meta: Reserva",
        "monthly_target": str(
            (primary.monthly_target if primary else Decimal("0.00")).quantize(Decimal("0.01"))
        ),
        "progress_percent": str(progress_percent.quantize(Decimal("0.01"))),
        "missing_amount": str(missing_amount.quantize(Decimal("0.01"))),
        "results": goals,
    }
