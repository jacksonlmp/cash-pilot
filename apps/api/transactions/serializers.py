from rest_framework import serializers

from cards.models import Card
from categories.models import Category
from transactions.models import Transaction
from wallets.models import Wallet

INCOME_CATEGORIES = ("Salário", "Benefícios", "Extra")


class TransactionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = (
            "id",
            "title",
            "category",
            "kind",
            "amount",
            "occurred_at",
            "wallet_id",
            "card_id",
            "payment_method",
            "expense_type",
            "is_installment",
            "installment_count",
        )


class TransactionCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=140)
    category = serializers.CharField(max_length=80, required=False)
    category_id = serializers.IntegerField(required=False)
    kind = serializers.ChoiceField(
        choices=[
            Transaction.TransactionKind.INCOME,
            Transaction.TransactionKind.EXPENSE,
        ]
    )
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    wallet_id = serializers.IntegerField(required=False)
    card_id = serializers.IntegerField(required=False)
    payment_method = serializers.ChoiceField(
        choices=[
            Transaction.PaymentMethod.BENEFIT,
            Transaction.PaymentMethod.CREDIT,
            Transaction.PaymentMethod.DEBIT,
            Transaction.PaymentMethod.PIX,
        ],
        required=False,
    )
    expense_type = serializers.ChoiceField(
        choices=[
            Transaction.ExpenseType.ESSENTIAL,
            Transaction.ExpenseType.NON_ESSENTIAL,
        ],
        required=False,
    )
    is_installment = serializers.BooleanField(required=False, default=False)
    installment_count = serializers.IntegerField(required=False, min_value=1, default=1)
    occurred_at = serializers.DateTimeField(required=False)

    def validate_wallet_id(self, value):
        user = self.context["user"]
        if not Wallet.objects.filter(id=value, user=user).exists():
            raise serializers.ValidationError("Wallet not found.")
        return value

    def validate_card_id(self, value):
        user = self.context["user"]
        if not Card.objects.filter(id=value, user=user).exists():
            raise serializers.ValidationError("Card not found.")
        return value

    def validate(self, attrs):
        kind = attrs["kind"]

        if kind == Transaction.TransactionKind.INCOME:
            if attrs.get("category") not in INCOME_CATEGORIES:
                raise serializers.ValidationError(
                    {"category": "Categoria de entrada inválida."}
                )
            if not attrs.get("wallet_id"):
                raise serializers.ValidationError({"wallet_id": "Selecione uma carteira."})
            return attrs

        category_id = attrs.get("category_id")
        payment_method = attrs.get("payment_method")
        wallet_id = attrs.get("wallet_id")
        card_id = attrs.get("card_id")
        is_installment = attrs.get("is_installment", False)
        installment_count = attrs.get("installment_count", 1)

        if category_id:
            try:
                category = Category.objects.get(
                    id=category_id,
                    category_kind=Category.CategoryKind.EXPENSE,
                    is_active=True,
                )
            except Category.DoesNotExist as exc:
                raise serializers.ValidationError({"category_id": "Categoria inválida."}) from exc
        elif attrs.get("category"):
            try:
                category = Category.objects.get(
                    name=attrs["category"],
                    category_kind=Category.CategoryKind.EXPENSE,
                    is_active=True,
                )
            except Category.DoesNotExist as exc:
                raise serializers.ValidationError({"category_id": "Selecione uma categoria."}) from exc
        else:
            raise serializers.ValidationError({"category_id": "Selecione uma categoria."})

        attrs["expense_category"] = category
        attrs["category"] = category.name

        if not payment_method:
            raise serializers.ValidationError({"payment_method": "Selecione a forma de pagamento."})

        if payment_method == Transaction.PaymentMethod.CREDIT:
            if not card_id:
                raise serializers.ValidationError({"card_id": "Selecione um cartão."})
            card = Card.objects.get(id=card_id, user=self.context["user"])
            if card.card_kind != Card.CardKind.CREDIT:
                raise serializers.ValidationError({"card_id": "Selecione um cartão de crédito válido."})
            if wallet_id:
                attrs["wallet_id"] = None
        else:
            if not wallet_id:
                raise serializers.ValidationError({"wallet_id": "Selecione a origem do pagamento."})
            if card_id:
                raise serializers.ValidationError({"card_id": "Cartão só pode ser usado em crédito."})

        if payment_method == Transaction.PaymentMethod.BENEFIT:
            wallet = Wallet.objects.get(id=wallet_id, user=self.context["user"])
            if wallet.wallet_type != Wallet.WalletType.BENEFIT:
                raise serializers.ValidationError({"wallet_id": "Selecione uma carteira de benefícios."})

        if payment_method in (Transaction.PaymentMethod.DEBIT, Transaction.PaymentMethod.PIX):
            wallet = Wallet.objects.get(id=wallet_id, user=self.context["user"])
            if wallet.wallet_type not in (Wallet.WalletType.BANK, Wallet.WalletType.CASH):
                raise serializers.ValidationError({"wallet_id": "Selecione uma carteira bancária ou em dinheiro."})

        if payment_method != Transaction.PaymentMethod.CREDIT and installment_count > 1:
            raise serializers.ValidationError(
                {"installment_count": "Parcelamento só é permitido para crédito."}
            )

        if payment_method != Transaction.PaymentMethod.CREDIT and is_installment:
            raise serializers.ValidationError(
                {"is_installment": "Parcelamento só é permitido para crédito."}
            )

        if payment_method == Transaction.PaymentMethod.CREDIT and is_installment and installment_count < 2:
            raise serializers.ValidationError(
                {"installment_count": "Informe pelo menos 2 parcelas para compra parcelada."}
            )

        if payment_method == Transaction.PaymentMethod.CREDIT and not is_installment:
            attrs["installment_count"] = 1

        return attrs
