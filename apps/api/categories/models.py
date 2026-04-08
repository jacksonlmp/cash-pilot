from django.db import models


class Category(models.Model):
    class CategoryKind(models.TextChoices):
        EXPENSE = "expense", "Expense"

    name = models.CharField(max_length=80, unique=True)
    category_kind = models.CharField(max_length=20, choices=CategoryKind.choices)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("display_order", "name")

    def __str__(self):
        return self.name
