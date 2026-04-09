from rest_framework import serializers

from transactions.serializers import TransactionListSerializer


class AlertSerializer(serializers.Serializer):
    type = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    icon_key = serializers.CharField()


class HeaderSerializer(serializers.Serializer):
    display_name = serializers.CharField()
    current_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    status_label = serializers.CharField()


class MonthlySummarySerializer(serializers.Serializer):
    income = serializers.DecimalField(max_digits=12, decimal_places=2)
    expenses = serializers.DecimalField(max_digits=12, decimal_places=2)
    net_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    budget_progress_percent = serializers.DecimalField(max_digits=7, decimal_places=2)
    variable_budget_remaining = serializers.DecimalField(
        max_digits=12, decimal_places=2
    )


class ReserveGoalSerializer(serializers.Serializer):
    title = serializers.CharField()
    monthly_target = serializers.DecimalField(max_digits=12, decimal_places=2)
    progress_percent = serializers.DecimalField(max_digits=7, decimal_places=2)
    missing_amount = serializers.DecimalField(max_digits=12, decimal_places=2)


class DebtSummaryCardSerializer(serializers.Serializer):
    strategy_name = serializers.CharField()
    payoff_month = serializers.CharField(allow_null=True)
    total_remaining = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_payment = serializers.DecimalField(max_digits=12, decimal_places=2)


class BenefitCardSerializer(serializers.Serializer):
    title = serializers.CharField()
    holder_name = serializers.CharField()
    last_four = serializers.CharField()
    current_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_spend = serializers.DecimalField(max_digits=12, decimal_places=2)
    usage_percent = serializers.DecimalField(max_digits=7, decimal_places=2)


class DashboardSummarySerializer(serializers.Serializer):
    header = HeaderSerializer()
    monthly_summary = MonthlySummarySerializer()
    reserve_goal = ReserveGoalSerializer()
    debt_summary = DebtSummaryCardSerializer()
    alerts = AlertSerializer(many=True)
    benefit_card = BenefitCardSerializer()
    transactions_preview = TransactionListSerializer(many=True)
