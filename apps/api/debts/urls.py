from django.urls import path

from debts.views import DebtSummaryView

urlpatterns = [
    path("summary/", DebtSummaryView.as_view(), name="debt-summary"),
]
