import pytest

from insights.selectors import get_alerts_summary, get_dashboard_summary
from users.services import ensure_demo_data


@pytest.mark.django_db
def test_get_dashboard_summary_returns_expected_sections():
    user = ensure_demo_data()

    summary = get_dashboard_summary(user)

    assert summary["header"]["display_name"] == "Jackson"
    assert "monthly_summary" in summary
    assert "reserve_goal" in summary
    assert "debt_summary" in summary
    assert len(summary["transactions_preview"]) > 0


@pytest.mark.django_db
def test_get_alerts_summary_returns_demo_alerts():
    user = ensure_demo_data()

    alerts = get_alerts_summary(user)

    titles = {alert["title"] for alert in alerts}
    assert "Restaurante acima do limite" in titles
    assert "Caju esta acabando" in titles
