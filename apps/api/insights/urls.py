from django.urls import path

from insights.views import AlertsView

urlpatterns = [
    path("alerts/", AlertsView.as_view(), name="insights-alerts"),
]
