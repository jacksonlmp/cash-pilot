from django.db.models import QuerySet

from transactions.models import Transaction


def get_filtered_transactions(user) -> QuerySet[Transaction]:
    return Transaction.objects.filter(user=user).select_related("wallet").order_by(
        "-occurred_at", "-id"
    )
