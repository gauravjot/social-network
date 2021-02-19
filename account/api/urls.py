from django.urls import path
from .views import Index, personInfo, signup, login

urlpatterns = [
    path('', Index),
    path('person/<int:pk>/', personInfo),
    path('person/signup', signup),
    path('person/login', login)
]