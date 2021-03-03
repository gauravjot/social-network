from rest_framework import serializers
from friends.models import Friend, FriendRequest

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ['id', 'user_a','user_b','since']

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['id','from_user', 'to_user', 'since']
        extra_kwargs = {
            'accepted': {'required':False},
        }