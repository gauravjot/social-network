from django.urls import path
from .views import personInfo, signup, login

urlpatterns = [
    path('api/person/<int:pk>/', personInfo),
    path('api/person/signup', signup),
    path('api/person/login', login)
]