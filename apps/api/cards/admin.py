from django.contrib import admin

from cards.models import Card


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "user",
        "card_kind",
        "brand",
        "current_balance",
        "monthly_spend",
    )
    list_filter = ("card_kind", "brand")
    search_fields = ("name", "holder_name", "user__username")
