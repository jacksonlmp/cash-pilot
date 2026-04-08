import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_debt_summary_endpoint_returns_strategy_and_results():
    client = APIClient()

    response = client.get("/api/debts/summary/")

    assert response.status_code == 200
    payload = response.json()
    assert payload["strategy_name"] == "Bola de Neve"
    assert len(payload["results"]) >= 1
