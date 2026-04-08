from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from users.services import get_request_user
from wallets.selectors import get_wallet_summary
from wallets.serializers import WalletSummarySerializer


class WalletSummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        summary = get_wallet_summary(get_request_user(request))
        serializer = WalletSummarySerializer(summary)
        return Response(serializer.data)
