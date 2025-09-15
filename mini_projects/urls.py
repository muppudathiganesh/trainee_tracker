from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MiniProjectViewSet

router = DefaultRouter()
router.register(r"mini-projects", MiniProjectViewSet, basename="mini-projects")

urlpatterns = [
    path("", include(router.urls)),
]
