from django.contrib import admin

from transactions.models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "wallet", "kind", "amount", "occurred_at")
    list_filter = ("kind", "category")
    search_fields = ("title", "category", "user__username")
