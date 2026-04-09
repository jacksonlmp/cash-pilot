from django.utils import timezone
from rest_framework.generics import ListCreateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny

from cards.models import Card
from transactions.selectors import get_filtered_transactions
from transactions.serializers import (
    TransactionCreateSerializer,
    TransactionListSerializer,
)
from transactions.services import register_transaction
from users.services import get_request_user
from wallets.models import Wallet


class TransactionPagination(PageNumberPagination):
    page_size = 20


class TransactionListCreateView(ListCreateAPIView):
    permission_classes = [AllowAny]
    pagination_class = TransactionPagination

    def get_queryset(self):
        return get_filtered_transactions(get_request_user(self.request))

    def get_serializer_class(self):
        if self.request.method == "POST":
            return TransactionCreateSerializer
        return TransactionListSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["user"] = get_request_user(self.request)
        return context

    def perform_create(self, serializer):
        user = get_request_user(self.request)
        wallet = None
        if serializer.validated_data.get("wallet_id"):
            wallet = Wallet.objects.get(
                id=serializer.validated_data["wallet_id"], user=user
            )
        card = None
        if serializer.validated_data.get("card_id"):
            card = Card.objects.get(id=serializer.validated_data["card_id"], user=user)
        occurred_at = serializer.validated_data.get("occurred_at", timezone.now())
        self.instance = register_transaction(
            user=user,
            wallet=wallet,
            card=card,
            expense_category=serializer.validated_data.get("expense_category"),
            title=serializer.validated_data["title"],
            category=serializer.validated_data["category"],
            kind=serializer.validated_data["kind"],
            amount=serializer.validated_data["amount"],
            occurred_at=occurred_at,
            payment_method=serializer.validated_data.get("payment_method", ""),
            expense_type=serializer.validated_data.get("expense_type", ""),
            is_installment=serializer.validated_data.get("is_installment", False),
            installment_count=serializer.validated_data.get("installment_count", 1),
        )

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        response.data = TransactionListSerializer(self.instance).data
        return response
