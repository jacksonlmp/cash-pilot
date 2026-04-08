from rest_framework import serializers

from cards.models import Card


class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = (
            "id",
            "name",
            "card_kind",
            "holder_name",
            "brand",
            "last_four",
            "current_balance",
            "monthly_spend",
            "total_limit",
            "closing_day",
        )


class BenefitCardSerializer(serializers.Serializer):
    title = serializers.CharField()
    holder_name = serializers.CharField()
    last_four = serializers.CharField()
    current_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_spend = serializers.DecimalField(max_digits=12, decimal_places=2)
    usage_percent = serializers.DecimalField(max_digits=7, decimal_places=2)


class CardSummarySerializer(serializers.Serializer):
    benefit_card = BenefitCardSerializer()
    results = CardSerializer(many=True)
