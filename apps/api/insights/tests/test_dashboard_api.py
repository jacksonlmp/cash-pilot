import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_dashboard_summary_endpoint_returns_structured_payload():
    client = APIClient()

    response = client.get("/api/dashboard/summary/")

    assert response.status_code == 200
    assert "header" in response.json()
    assert "alerts" in response.json()
    assert "benefit_card" in response.json()
