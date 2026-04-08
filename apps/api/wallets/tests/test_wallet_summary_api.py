import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_wallet_summary_endpoint_returns_grouped_balances():
    client = APIClient()

    response = client.get("/api/wallets/summary/")

    assert response.status_code == 200
    payload = response.json()
    assert "grouped_balances" in payload
    assert len(payload["results"]) >= 1
