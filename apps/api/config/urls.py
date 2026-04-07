from django.contrib import admin
from django.urls import include, path

from config.views import health

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health, name="health"),
    path("api/users/", include("users.urls")),
    path("api/transactions/", include("transactions.urls")),
    path("api/wallets/", include("wallets.urls")),
    path("api/cards/", include("cards.urls")),
    path("api/goals/", include("goals.urls")),
    path("api/debts/", include("debts.urls")),
    path("api/insights/", include("insights.urls")),
]
