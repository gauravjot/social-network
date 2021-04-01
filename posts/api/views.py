from django.views.decorators.csrf import csrf_exempt
import pytz
from django.db.models import Q

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from account.models import Token
from account.api.serializers import PersonSerializer
from posts.api.serializers import PostsSerializer
from posts.models import Posts
from friends.models import Friend
from account.models import Person
from notifications.models import Notification

import json
from datetime import datetime, time
from helpers.error_messages import UNAUTHORIZED, INVALID_TOKEN
from helpers.api_error_response import errorResponse

# Get Posts of a user, Auth: not required
# -----------------------------------------------
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

# Returns only self posts of an user, Auth: REQUIRED
# -----------------------------------------------
@api_view(['GET'])
def getLoggedInUserPosts(request):
    person_id = getPersonID(request)
    # If person_id type is Response that means we have errored
    if type(person_id) is Response:
        return person_id
    return __personPosts(person_id)

# Returns self + friends posts, Auth: REQUIRED
# -----------------------------------------------
@api_view(['GET'])
def getPosts(request):
    person_id = getPersonID(request)
    # If person_id type is Response that means we have errored
    if type(person_id) is Response:
        return person_id

    try:
        data = Friend.objects.filter(Q(user_a=person_id) | Q(user_b=person_id))
        friends = [entry.user_a if entry.user_a is not person_id else entry.user_b for entry in data]
        friends.append(person_id)
        data = Posts.objects.filter(person_id__in=friends).order_by('pk').values()
        posts_final = []
        for post in data:
            post_by = PersonSerializer(Person.objects.get(pk=post['person_id'])).data
            posts_final.append({**PostsSerializer(Posts.objects.get(pk=post['id'])).data,"person":post_by})
        if posts_final:
            return Response(data=posts_final,status=status.HTTP_200_OK)
        else:
            return Response(errorResponse("No posts found!"),status=status.HTTP_404_NOT_FOUND)
    except Friend.DoesNotExist:
        data = Posts.objects.filter(person_id=person_id)
        postsSerializer = PostsSerializer(data, many=True)
        if postsSerializer.data:
            return Response(data=postsSerializer.data,status=status.HTTP_200_OK)
        else:
            return Response(errorResponse("No posts found!"),status=status.HTTP_404_NOT_FOUND)

# create new post, auth required
# -----------------------------------------------
@api_view(['POST'])
def newPost(request):
    person_id = getPersonID(request)
    # If person_id type is Response that means we have errored
    if type(person_id) is Response:
        return person_id
    if request.data['post_image'] != "null":
        print(request.data['post_image'])
        req_data = {'post_text':request.data['post_text'],'post_image':request.data['post_image']}
    else:
        req_data = {'post_text':request.data['post_text']}
    time_stamp = datetime.now().timestamp()
    postsSerializer = PostsSerializer(data={**req_data,**{'person_id':person_id,'created':time_stamp,'updated':time_stamp}})
    if (postsSerializer.is_valid()):
        postsSerializer.save()
        return Response(data=postsSerializer.data, status=status.HTTP_201_CREATED)
    return Response(postsSerializer.errors,status=status.HTTP_400_BAD_REQUEST)

# For operations on one singular post, Auth: REQUIRED
# @url: api/post/<int:pk>
# -----------------------------------------------
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

# Get one specific post, Auth: not required
# -----------------------------------------------
def getPost(post_key):
    try:
        data = Posts.objects.get(pk=post_key)
        post_by = PersonSerializer(Person.objects.get(pk=data.person_id)).data
        return Response(data={**PostsSerializer(Posts.objects.get(pk=data.id)).data,"person":post_by},status=status.HTTP_200_OK)
    except Posts.DoesNotExist:
        return Response(errorResponse("Post not found!"),status=status.HTTP_404_NOT_FOUND)

# Like or unlike a post, Auth: REQUIRED
# -----------------------------------------------
def likePost(request, post_key):
    person_id = getPersonID(request)
    # If person_id type is Response that means we have errored
    if type(person_id) is Response:
        return person_id
    post = Posts.objects.get(pk=post_key)
    if post.likes:
        if person_id in post.likes['persons']:
            post.likes['persons'].remove(person_id)
            isLiked = False
        else:
            post.likes['persons'].append(person_id)
            isLiked = True
    else:
        post.likes = dict(persons=[(person_id)])
    post.save()
    # make a notification to send
    if post.person_id != person_id and isLiked:
        notification = Notification(
            noti=0,
            person_for=post.person_id,
            person_from=person_id,
            about=post.id,
            created=datetime.now().timestamp()
        )
        notification.save()
    return Response(json.loads('{"action":"success"}'),status=status.HTTP_200_OK)

# Edit a post, Auth: REQUIRED
# @required in request: post_text, post_image
# -----------------------------------------------
def editPost(request, post_key):
    person_id = getPersonID(request)
    # If person_id type is Response that means we have errored
    if type(person_id) is Response:
        return person_id
    post = Posts.objects.get(pk=post_key)
    if post.person == person_id:
        post.post_text = request.data['post_text']
        post.post_image = request.data['post_image']
        post.updated = datetime.now(tz=pytz.utc)
        post.save()
        return Response(PostsSerializer(post).data,status=status.HTTP_200_OK)
    else:
        return Response(errorResponse(UNAUTHORIZED),status=status.HTTP_401_UNAUTHORIZED)

# delete a post, Auth: REQUIRED
# -----------------------------------------------
def deletePost(request, post_key):
    person_id = getPersonID(request)
    # If person_id type is Response that means we have errored
    if type(person_id) is Response:
        return person_id
    post = Posts.objects.get(pk=post_key)
    if post.person == person_id:
        post.delete()
        return Response(json.loads('{"action":"success"}'),status=status.HTTP_200_OK)
    else:
        return Response(errorResponse(UNAUTHORIZED),status=status.HTTP_401_UNAUTHORIZED)





# Helper Functions
# *********************************************
def getPersonID(request):
    try:
        token = request.headers['Authorization'].split()[-1]
    except [KeyError, Token.DoesNotExist]:
        return Response(errorResponse(UNAUTHORIZED),status=status.HTTP_401_UNAUTHORIZED)
    try:
        return Token.objects.get(token=token).account
    except Token.DoesNotExist:
        return Response(errorResponse(INVALID_TOKEN),status=status.HTTP_400_BAD_REQUEST)