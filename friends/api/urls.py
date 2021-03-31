from django.urls import path
from .views import getFriends, getFriendRequests, sendFriendRequest, acceptFriendRequest, deleteFriendRequest, getFriendSuggestions

urlpatterns = [
    # auth token required in header for all requests
    path('api/friends/', getFriends), # GET request
    path('api/friends/requests/', getFriendRequests), # GET request
    path('api/friends/request/send/', sendFriendRequest), # POST request
    path('api/friends/request/accept/', acceptFriendRequest), # PUT request
    path('api/friends/request/delete/<int:pk>', deleteFriendRequest), # DELETE request
    path('api/friends/suggestions/', getFriendSuggestions), # GET request
    #path('api/friend/unfriend',''), #DELETE request
]