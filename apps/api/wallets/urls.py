from django.urls import path

from wallets.views import WalletSummaryView

urlpatterns = [
    path("summary/", WalletSummaryView.as_view(), name="wallet-summary"),
]
