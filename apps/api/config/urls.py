from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from rest_framework.permissions import AllowAny

from config.views import health

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health, name="health"),
    path(
        "api/schema/",
        SpectacularAPIView.as_view(permission_classes=[AllowAny]),
        name="schema",
    ),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema", permission_classes=[AllowAny]),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema", permission_classes=[AllowAny]),
        name="redoc",
    ),
    path("api/users/", include("users.urls")),
    path("api/transactions/", include("transactions.urls")),
    path("api/wallets/", include("wallets.urls")),
    path("api/cards/", include("cards.urls")),
    path("api/goals/", include("goals.urls")),
    path("api/debts/", include("debts.urls")),
    path("api/insights/", include("insights.urls")),
]
