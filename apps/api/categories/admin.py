from django.contrib import admin

from categories.models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "category_kind", "is_active", "display_order")
    list_filter = ("category_kind", "is_active")
    search_fields = ("name",)
