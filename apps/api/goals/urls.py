from django.urls import path

from goals.views import GoalSummaryView

urlpatterns = [
    path("summary/", GoalSummaryView.as_view(), name="goal-summary"),
]
