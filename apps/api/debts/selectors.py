from decimal import Decimal

from django.db.models import Sum

from debts.models import Debt


def get_debt_summary(user):
    debts = list(
        Debt.objects.filter(user=user).order_by("display_order", "payoff_date")
    )
    totals = Debt.objects.filter(user=user).aggregate(
        total_remaining=Sum("total_remaining"),
        monthly_payment=Sum("monthly_payment"),
    )
    primary = debts[0] if debts else None
    return {
        "strategy_name": primary.strategy_name if primary else "Bola de Neve",
        "payoff_month": (
            primary.payoff_date.strftime("%B / %Y").capitalize() if primary else None
        ),
        "total_remaining": str(
            (totals["total_remaining"] or Decimal("0.00")).quantize(Decimal("0.01"))
        ),
        "monthly_payment": str(
            (totals["monthly_payment"] or Decimal("0.00")).quantize(Decimal("0.01"))
        ),
        "results": debts,
    }
