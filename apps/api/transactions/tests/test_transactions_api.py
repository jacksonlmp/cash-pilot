import pytest
from rest_framework.test import APIClient

from categories.models import Category


def ensure_expense_categories():
    for index, name in enumerate(
        ["Lazer", "Alimentação", "Transporte", "Saúde", "Moradia", "Casa"],
        start=1,
    ):
        Category.objects.get_or_create(
            name=name,
            defaults={
                "category_kind": Category.CategoryKind.EXPENSE,
                "display_order": index,
            },
        )


@pytest.mark.django_db
def test_create_transaction_endpoint_creates_income_for_demo_wallet():
    client = APIClient()
    summary_response = client.get("/api/wallets/summary/")
    wallet_id = summary_response.json()["results"][0]["id"]

    response = client.post(
        "/api/transactions/",
        {
            "title": "Salário",
            "category": "Salário",
            "kind": "income",
            "amount": "300.00",
            "wallet_id": wallet_id,
            "occurred_at": "2026-04-08T12:00:00Z",
        },
        format="json",
    )

    assert response.status_code == 201
    assert response.json()["title"] == "Salário"


@pytest.mark.django_db
def test_create_transaction_endpoint_rejects_invalid_income_category():
    client = APIClient()
    summary_response = client.get("/api/wallets/summary/")
    wallet_id = summary_response.json()["results"][0]["id"]

    response = client.post(
        "/api/transactions/",
        {
            "title": "Receita livre",
            "category": "Receita",
            "kind": "income",
            "amount": "300.00",
            "wallet_id": wallet_id,
        },
        format="json",
    )

    assert response.status_code == 400
    assert "category" in response.json()


@pytest.mark.django_db
def test_transactions_list_endpoint_returns_paginated_results():
    client = APIClient()

    response = client.get("/api/transactions/")

    assert response.status_code == 200
    assert "count" in response.json()
    assert "results" in response.json()


@pytest.mark.django_db
def test_expense_categories_endpoint_returns_seeded_options():
    ensure_expense_categories()
    client = APIClient()

    response = client.get("/api/categories/expense/")

    assert response.status_code == 200
    assert any(item["name"] == "Lazer" for item in response.json())


@pytest.mark.django_db
def test_create_transaction_endpoint_creates_credit_installment_expense():
    ensure_expense_categories()
    client = APIClient()
    categories_response = client.get("/api/categories/expense/")
    cards_response = client.get("/api/cards/summary/")
    category_id = next(item["id"] for item in categories_response.json() if item["name"] == "Lazer")
    card_id = next(item["id"] for item in cards_response.json()["results"] if item["card_kind"] == "credit")

    response = client.post(
        "/api/transactions/",
        {
            "title": "Jantar com amigos",
            "kind": "expense",
            "amount": "250.00",
            "category_id": category_id,
            "payment_method": "credit",
            "expense_type": "non_essential",
            "card_id": card_id,
            "is_installment": True,
            "installment_count": 5,
            "occurred_at": "2026-04-08T12:00:00Z",
        },
        format="json",
    )

    assert response.status_code == 201
    assert response.json()["payment_method"] == "credit"
    assert response.json()["installment_count"] == 5


@pytest.mark.django_db
def test_create_transaction_endpoint_rejects_credit_without_card():
    ensure_expense_categories()
    client = APIClient()
    categories_response = client.get("/api/categories/expense/")
    category_id = next(item["id"] for item in categories_response.json() if item["name"] == "Lazer")

    response = client.post(
        "/api/transactions/",
        {
            "title": "Jantar com amigos",
            "kind": "expense",
            "amount": "250.00",
            "category_id": category_id,
            "payment_method": "credit",
            "expense_type": "non_essential",
            "is_installment": True,
            "installment_count": 5,
        },
        format="json",
    )

    assert response.status_code == 400
    assert "card_id" in response.json()


@pytest.mark.django_db
def test_create_transaction_endpoint_rejects_installments_outside_credit():
    ensure_expense_categories()
    client = APIClient()
    categories_response = client.get("/api/categories/expense/")
    wallets_response = client.get("/api/wallets/summary/")
    category_id = next(item["id"] for item in categories_response.json() if item["name"] == "Casa")
    wallet_id = wallets_response.json()["results"][0]["id"]

    response = client.post(
        "/api/transactions/",
        {
            "title": "Supermercado",
            "kind": "expense",
            "amount": "120.00",
            "category_id": category_id,
            "payment_method": "pix",
            "expense_type": "essential",
            "wallet_id": wallet_id,
            "is_installment": True,
            "installment_count": 3,
        },
        format="json",
    )

    assert response.status_code == 400
    assert "installment_count" in response.json() or "is_installment" in response.json()
