from django.contrib import admin

from wallets.models import Wallet


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "wallet_type", "balance", "monthly_budget")
    list_filter = ("wallet_type",)
    search_fields = ("name", "user__username", "user__email")
