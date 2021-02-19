from django.urls import path
from .views import personPosts, newPost, postOperations

urlpatterns = [
    path('api/person/<int:pk>/posts/', personPosts),
    path('api/post/new', newPost),
    path('api/post/<int:pk>', postOperations), # get, need auth any TODO: friend # put, need auth any # post, need auth author # delete, need auth author
]