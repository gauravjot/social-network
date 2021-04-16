from rest_framework import serializers
from posts.models import Posts, Comment

from account.models import Person
from account.api.serializers import PersonSerializer

class PostsSerializer(serializers.ModelSerializer):

    likes = serializers.SerializerMethodField()

    def get_likes(self,obj):
        if obj.likes and obj.likes['persons']:
            people = []
            for person in obj.likes['persons']:
                people.append(PersonSerializer(Person.objects.get(pk=person)).data)
            return dict(persons=people)

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