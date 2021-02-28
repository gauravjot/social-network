from rest_framework import serializers
from posts.models import Posts

class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Posts
        fields = ['id', 'person_id','post_text','post_image','likes', 'created', 'updated']
        extra_kwargs = {
            'created': {'required':False},
            'updated': {'required':False},
            'post_image': {'required':False},
            'likes': {'required':False}
        }