from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsTrainerOrReadOnly(BasePermission):
    """
    Trainers (is_staff) can do everything.
    Trainees can only update their own project status.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.is_staff:  # Trainers can do anything
            return True

        if request.method in SAFE_METHODS:  # GET, HEAD, OPTIONS
            return obj.assigned_to == user

        if request.method in ["PUT", "PATCH"]:
            return obj.assigned_to == user

        return False
