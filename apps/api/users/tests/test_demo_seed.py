import pytest

from users.services import ensure_demo_data
from wallets.models import Wallet


@pytest.mark.django_db
def test_ensure_demo_data_populates_dashboard_records():
    user = ensure_demo_data()

    assert user.username == "demo"
    assert Wallet.objects.filter(user=user).count() >= 3
