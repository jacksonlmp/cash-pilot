from decimal import Decimal

from django.db.models import Sum

from wallets.models import Wallet


def get_wallet_summary(user):
    wallets = list(Wallet.objects.filter(user=user).order_by("display_order", "name"))
    total_balance = (
        Wallet.objects.filter(user=user).aggregate(total=Sum("balance"))["total"]
        or Decimal("0.00")
    )
    grouped = {
        wallet.wallet_type: str(wallet.balance.quantize(Decimal("0.01"))) for wallet in wallets
    }
    return {
        "total_balance": str(total_balance.quantize(Decimal("0.01"))),
        "results": wallets,
        "grouped_balances": grouped,
    }
