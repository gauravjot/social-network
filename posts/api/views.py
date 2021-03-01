from django.views.decorators.csrf import csrf_exempt
import pytz

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from account.models import Token
from posts.api.serializers import PostsSerializer
from posts.models import Posts

import json
from datetime import datetime

# Create your views here.
@api_view(['GET'])
def personPosts(request, pk):
    return __personPosts(pk)

def __personPosts(pk):
    person_id = pk
    data = Posts.objects.filter(person_id=person_id)
    postsSerializer = PostsSerializer(data, many=True)
    if postsSerializer.data:
        return Response(data=postsSerializer.data,status=status.HTTP_200_OK)
    else:
        return Response(errorResponse("No posts found!"),status=status.HTTP_404_NOT_FOUND)

# create new post, auth required
@api_view(['POST'])
def newPost(request):
    try:
        person_token = request.headers['Authorization'].split()[-1]
    except KeyError:
        return Response(errorResponse("Unauthorized."),status=status.HTTP_401_UNAUTHORIZED)
    try:
        person_id = Token.objects.get(token=person_token).account
        postsSerializer = PostsSerializer(data={**request.data,**{'person_id':person_id}})
        if (postsSerializer.is_valid()):
            postsSerializer.save()
            return Response(data=postsSerializer.validated_data, status=status.HTTP_201_CREATED)
        return Response(postsSerializer.errors,status=status.HTTP_400_BAD_REQUEST)
    except Token.DoesNotExist:
        return Response(errorResponse("Session expired, Please log in again!"),status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET','DELETE','PUT','POST'])
@csrf_exempt
def postOperations(request, pk):
    if request.method == 'GET':
        return getPost(pk)
    elif request.method == 'PUT':
        return likePost(request, pk)
    elif request.method == 'POST':
        return editPost(request, pk)
    elif request.method == 'DELETE':
        return deletePost(request, pk)
    return Response(errorResponse("unable to complete request"),status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Returns post of a logged in user, requires token
@api_view(['GET'])
def getLoggedInUserPosts(request):
    try:
        person_token = request.headers['Authorization'].split()[-1]
    except KeyError:
        return Response(errorResponse("Unauthorized."),status=status.HTTP_401_UNAUTHORIZED)
    try:
        person_id = Token.objects.get(token=person_token).account
        return __personPosts(person_id)
    except Token.DoesNotExist:
        return Response(errorResponse("Session expired, Please log in again!"),status=status.HTTP_400_BAD_REQUEST)

# Returns one specific post where pk is post id
def getPost(post_key):
    try:
        data = Posts.objects.get(pk=post_key)
        postsSerializer = PostsSerializer(data)
        return Response(data=postsSerializer.data,status=status.HTTP_200_OK)
    except Posts.DoesNotExist:
        return Response(errorResponse("Post not found!"),status=status.HTTP_404_NOT_FOUND)


# Like or unlike a post
def likePost(request, post_key):
    try:
        person_token = request.headers['Authorization'].split()[-1]
    except KeyError:
        return Response(errorResponse("Unauthorized."),status=status.HTTP_401_UNAUTHORIZED)
    try:
        person_id = Token.objects.get(token=person_token).account
        post = Posts.objects.get(pk=post_key)
        if person_id in post.likes['persons']:
            post.likes['persons'].remove(person_id)
        else:
            post.likes['persons'].append(person_id)
        post.save()
        return Response(json.loads('{"action":"success"}'),status=status.HTTP_200_OK)
    except Token.DoesNotExist:
        return Response(errorResponse("Session expired, Please log in again!"),status=status.HTTP_400_BAD_REQUEST)

# Edit post
# @required in request: post_text, post_image
def editPost(request, post_key):
    try:
        person_token = request.headers['Authorization'].split()[-1]
    except KeyError:
        return Response(errorResponse("Unauthorized."),status=status.HTTP_401_UNAUTHORIZED)
    try:
        person_id = Token.objects.get(token=person_token).account
        post = Posts.objects.get(pk=post_key)
        if post.person == person_id:
            post.post_text = request.data['post_text']
            post.post_image = request.data['post_image']
            post.updated = datetime.now(tz=pytz.utc)
            post.save()
            return Response(PostsSerializer(post).data,status=status.HTTP_200_OK)
        else:
            return Response(errorResponse("Unauthorized."),status=status.HTTP_401_UNAUTHORIZED)
    except Token.DoesNotExist:
        return Response(errorResponse("Session expired, Please log in again!"),status=status.HTTP_400_BAD_REQUEST)

# delete a post
def deletePost(request, post_key):
    try:
        person_token = request.headers['Authorization'].split()[-1]
    except KeyError:
        return Response(errorResponse("Unauthorized."),status=status.HTTP_401_UNAUTHORIZED)
    try:
        person_id = Token.objects.get(token=person_token).account
        post = Posts.objects.get(pk=post_key)
        if post.person == person_id:
            post.delete()
            return Response(json.loads('{"action":"success"}'),status=status.HTTP_200_OK)
        else:
            return Response(errorResponse("Unauthorized."),status=status.HTTP_401_UNAUTHORIZED)
    except Token.DoesNotExist:
        return Response(errorResponse("Session expired, Please log in again!"),status=status.HTTP_400_BAD_REQUEST)

# Helper Functions
# -----------------------------------------------
def errorResponse(message):
    return json.loads('{"error": ["' + message + '"]}')