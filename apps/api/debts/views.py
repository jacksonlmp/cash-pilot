from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from debts.selectors import get_debt_summary
from debts.serializers import DebtSummarySerializer
from users.services import get_request_user


class DebtSummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        summary = get_debt_summary(get_request_user(request))
        serializer = DebtSummarySerializer(summary)
        return Response(serializer.data)
