from rest_framework import serializers

from debts.models import Debt


class DebtSerializer(serializers.ModelSerializer):
    payoff_month = serializers.SerializerMethodField()

    class Meta:
        model = Debt
        fields = (
            "id",
            "title",
            "strategy_name",
            "total_remaining",
            "monthly_payment",
            "payoff_month",
        )

    def get_payoff_month(self, obj):
        return obj.payoff_date.strftime("%B / %Y").capitalize()


class DebtSummarySerializer(serializers.Serializer):
    strategy_name = serializers.CharField()
    payoff_month = serializers.CharField(allow_null=True)
    total_remaining = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_payment = serializers.DecimalField(max_digits=12, decimal_places=2)
    results = DebtSerializer(many=True)
