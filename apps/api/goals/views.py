from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from goals.selectors import get_goals_summary
from goals.serializers import GoalSummarySerializer
from users.services import get_request_user


class GoalSummaryView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        summary = get_goals_summary(get_request_user(request))
        serializer = GoalSummarySerializer(summary)
        return Response(serializer.data)
