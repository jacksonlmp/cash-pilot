from rest_framework import serializers

from goals.models import Goal


class GoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Goal
        fields = (
            "id",
            "name",
            "goal_type",
            "target_amount",
            "current_amount",
            "monthly_target",
        )


class GoalSummarySerializer(serializers.Serializer):
    title = serializers.CharField()
    monthly_target = serializers.DecimalField(max_digits=12, decimal_places=2)
    progress_percent = serializers.DecimalField(max_digits=7, decimal_places=2)
    missing_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    results = GoalSerializer(many=True)
