from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/block/", include("blocker.urls")),  # ✅ This ensures /api/block/blocked-items works
]
