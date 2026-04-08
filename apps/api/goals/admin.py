from django.contrib import admin

from goals.models import Goal


@admin.register(Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "goal_type", "current_amount", "target_amount")
    list_filter = ("goal_type",)
    search_fields = ("name", "user__username")
