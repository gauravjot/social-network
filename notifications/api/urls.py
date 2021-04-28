from django.urls import path
from .views import getNotifications, markAsSeen, markAllAsSeen

urlpatterns = [
    path('api/notifications/', getNotifications),
    path('api/notifications/<int:pk>/', markAsSeen),
    path('api/notifications/seen/', markAllAsSeen)
]