from django.urls import path
from . import views

urlpatterns = [
    path("start/", views.start_blocking, name="start_blocking"),
    path("stop/", views.stop_blocking, name="stop_blocking"),
    path("blocked-items/", views.blocked_items_list, name="blocked_items_list"),
    path("blocked-items/<int:id>/", views.blocked_item_detail, name="blocked_item_detail"),
]
