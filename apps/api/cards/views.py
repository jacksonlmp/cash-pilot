from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from cards.selectors import get_cards_summary
from cards.serializers import CardSummarySerializer
from users.services import get_request_user


class CardSummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        summary = get_cards_summary(get_request_user(request))
        serializer = CardSummarySerializer(summary)
        return Response(serializer.data)
