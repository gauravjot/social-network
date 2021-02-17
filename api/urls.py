from django.urls import path
from .views import Index, account

urlpatterns = [
    path('', Index),
    path('person/<int:pk>/', account)
]