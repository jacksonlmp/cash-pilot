from django.urls import path

from categories.views import ExpenseCategoryListView

urlpatterns = [
    path("expense/", ExpenseCategoryListView.as_view(), name="expense-category-list"),
]
