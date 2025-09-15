from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def home(request):
    return HttpResponse("🚀 Welcome to the Trainee Project Tracker API!")

urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/", include("mini_projects.urls")),   # ✅ now this will work
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
