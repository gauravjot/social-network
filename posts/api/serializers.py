from rest_framework import serializers
from posts.models import Posts, Comment

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

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id','post_id','person_id','comment_text','comment_likes','comment_parent',
            'created', 'updated']
        extra_kwargs = {
            'created': {'required':False},
            'updated': {'required':False},
            'comment_likes': {'required':False}
        }