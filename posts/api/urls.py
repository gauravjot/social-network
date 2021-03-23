from django.urls import path
from .views import personPosts, newPost, postOperations, getLoggedInUserPosts, getPosts
from .views_comments import getPostComments, postNewComment, actionsComment

urlpatterns = [
    path('api/person/<int:pk>/posts/', personPosts), # if we have a person id
    path('api/person/posts', getLoggedInUserPosts), # posts of logged in user
    path('api/post/new', newPost),
    path('api/post/<int:pk>', postOperations), # get, need auth any TODO: friend # put, need auth any # post, need auth author # delete, need auth author
    path('api/posts', getPosts),

    # Comments
    path('api/<int:post>/comments/', getPostComments),
    path('api/<int:post_id>/comments/new/', postNewComment),
    path('api/<int:post_id>/comments/<int:pk>', actionsComment) # like(PUT), update(POST), delete (DELETE) a comment 

]
