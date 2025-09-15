from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import MiniProject
from .serializers import MiniProjectSerializer


class IsTrainerOrReadOwnProjects(permissions.BasePermission):
    """
    Trainers (staff) → full access.
    Trainees (non-staff) → can only view/edit their own projects.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:  # Trainer
            return True
        return obj.assigned_to == request.user  # Trainee → only their projects

    def has_permission(self, request, view):
        return request.user.is_authenticated  # logged-in users only


class MiniProjectViewSet(viewsets.ModelViewSet):
    serializer_class = MiniProjectSerializer
    permission_classes = [IsTrainerOrReadOwnProjects]

    queryset = MiniProject.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['priority', 'status', 'due_date']  # ✅ Add filterable fields

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:  # Trainer
            return MiniProject.objects.all()
        return MiniProject.objects.filter(assigned_to=user)  # Trainee

    def perform_create(self, serializer):
        # Only Trainers can assign projects
        if self.request.user.is_staff:
            serializer.save()
        else:
            raise permissions.PermissionDenied("Only trainers can create projects.")

    def perform_update(self, serializer):
        if self.request.user.is_staff:
            # Trainers can update everything
            serializer.save()
        else:
            # Trainees can only update their own project status
            if "status" in serializer.validated_data:
                serializer.save()
            else:
                raise permissions.PermissionDenied(
                    "Trainees can only update project status."
                )
