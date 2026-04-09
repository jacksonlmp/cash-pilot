from rest_framework import serializers

from wallets.models import Wallet


class WalletSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="wallet_type")

    class Meta:
        model = Wallet
        fields = ("id", "name", "type", "balance", "monthly_budget")


class WalletSummarySerializer(serializers.Serializer):
    total_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    grouped_balances = serializers.DictField(child=serializers.CharField())
    results = WalletSerializer(many=True)
