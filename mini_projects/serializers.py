from rest_framework import serializers
from .models import MiniProject
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "is_staff"]

class MiniProjectSerializer(serializers.ModelSerializer):
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="assigned_to",
        write_only=True,
        required=False
    )

    class Meta:
        model = MiniProject
        fields = [
            "id", "title", "description",
            "priority", "status", "due_date",
            "created_at", "assigned_to", "assigned_to_id"
        ]

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if not user.is_staff:
            if "status" in validated_data:
                instance.status = validated_data["status"]
                instance.save()
                return instance
            raise serializers.ValidationError("Trainees can only update project status.")
        return super().update(instance, validated_data)
