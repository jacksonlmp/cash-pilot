from django.contrib import admin

from debts.models import Debt


@admin.register(Debt)
class DebtAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "user",
        "strategy_name",
        "total_remaining",
        "monthly_payment",
    )
    list_filter = ("strategy_name",)
    search_fields = ("title", "user__username")
