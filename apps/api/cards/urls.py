from django.urls import path

from cards.views import CardSummaryView

urlpatterns = [
    path("summary/", CardSummaryView.as_view(), name="card-summary"),
]
