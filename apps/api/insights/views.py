from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from insights.selectors import get_alerts_summary, get_dashboard_summary
from insights.serializers import AlertSerializer, DashboardSummarySerializer
from users.services import get_request_user


class DashboardSummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        summary = get_dashboard_summary(get_request_user(request))
        serializer = DashboardSummarySerializer(summary)
        return Response(serializer.data)


class AlertsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        serializer = AlertSerializer(
            get_alerts_summary(get_request_user(request)), many=True
        )
        return Response({"results": serializer.data})
