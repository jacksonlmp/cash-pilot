import json

from django.test import RequestFactory

from config.views import health


def test_health_returns_ok():
    request = RequestFactory().get("/health/")
    response = health(request)
    assert response.status_code == 200
    assert json.loads(response.content) == {"status": "ok"}
