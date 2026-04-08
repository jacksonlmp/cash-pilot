from decimal import Decimal

from cards.models import Card


def get_cards_summary(user):
    cards = list(Card.objects.filter(user=user).order_by("display_order", "name"))
    benefit_card = next((card for card in cards if card.card_kind == Card.CardKind.BENEFIT), None)
    if benefit_card:
        usage_percent = Decimal("0.00")
        if benefit_card.total_limit > 0:
            usage_percent = (benefit_card.monthly_spend / benefit_card.total_limit) * Decimal("100")
        benefit_summary = {
            "title": benefit_card.name,
            "holder_name": benefit_card.holder_name,
            "last_four": benefit_card.last_four,
            "current_balance": str(benefit_card.current_balance.quantize(Decimal("0.01"))),
            "monthly_spend": str(benefit_card.monthly_spend.quantize(Decimal("0.01"))),
            "usage_percent": str(usage_percent.quantize(Decimal("0.01"))),
        }
    else:
        benefit_summary = {
            "title": "Cartao MultiBeneficios",
            "holder_name": "",
            "last_four": "",
            "current_balance": "0.00",
            "monthly_spend": "0.00",
            "usage_percent": "0.00",
        }
    return {
        "benefit_card": benefit_summary,
        "results": cards,
    }
