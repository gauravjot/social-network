from django.contrib import admin
from friends.models import Friend, FriendRequest

# Register your models here.
admin.site.register(Friend)
admin.site.register(FriendRequest)
