from django.urls import path
from .views import personInfo, signup, login, logout

urlpatterns = [
    path('api/person/<slug:slug>/', personInfo),
    path('api/person/signup', signup),
    path('api/person/login', login),
    path('api/person/logout', logout),
]