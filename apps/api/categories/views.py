from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from categories.models import Category
from categories.serializers import CategorySerializer


class ExpenseCategoryListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(
            category_kind=Category.CategoryKind.EXPENSE,
            is_active=True,
        ).order_by("display_order", "name")
