from django.urls import path

from transactions.views import TransactionListCreateView

urlpatterns = [
    path("", TransactionListCreateView.as_view(), name="transactions-list"),
]
