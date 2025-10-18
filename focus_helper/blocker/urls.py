# blocker/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('block/start/', views.start_blocking, name='start_blocking'),
    path('block/stop/', views.stop_blocking, name='stop_blocking'),
]
