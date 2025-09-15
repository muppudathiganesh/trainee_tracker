from django.contrib import admin
from .models import MiniProject


@admin.register(MiniProject)
class MiniProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "assigned_to", "priority", "status", "due_date", "created_at")
    list_filter = ("priority", "status", "due_date")
    search_fields = ("title", "description", "assigned_to__username")
    ordering = ("due_date",)
    date_hierarchy = "due_date"

    # 🔒 Restrict projects based on user role
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_staff:  # Trainer
            return qs
        return qs.filter(assigned_to=request.user)  # Trainee → only their projects

    # 🔒 Trainees should not reassign projects
    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_staff:  # Trainee
            return [f.name for f in self.model._meta.fields if f.name != "status"]
        return super().get_readonly_fields(request, obj)

    # 🔒 Trainees cannot add or delete projects
    def has_add_permission(self, request):
        return request.user.is_staff

    def has_delete_permission(self, request, obj=None):
        return request.user.is_staff
