from datetime import datetime, timedelta
import pytz
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import PersonSerializer
from account.models import Person, Token
from posts.models import Comment, Posts
from posts.api.serializers import CommentSerializer, PostsSerializer
from friends.models import Friend

import json
import bcrypt
from secrets import token_hex
from random import randrange
from helpers.error_messages import UNAUTHORIZED, INVALID_TOKEN, INVALID_REQUEST

# Get profile info
# -----------------------------------------------
@api_view(['GET'])
def personInfo(request, slug):
    requesting_person = getPersonID(request)
    if type(requesting_person) is Response:
        return requesting_person

    try:
        data = Person.objects.get(slug=slug)
        wanted_person = data.id
        personSerializer = PersonSerializer(data)
        #comments
        comments = CommentSerializer(Comment.objects.filter(person_id=wanted_person).order_by('pk')[:3].values(), many=True).data
        posts = PostsSerializer(Posts.objects.filter(person_id=wanted_person).values(),many=True).data
        
        try:
            data = Friend.objects.filter(Q(user_a=wanted_person) | Q(user_b=wanted_person))
            friends = [entry.user_a if entry.user_a is not wanted_person else entry.user_b for entry in data]
            if friends:
                persons = Person.objects.filter(id__in=friends)
                persons_dict = [PersonSerializer(person).data for person in persons]
                friends = persons_dict
        except Friend.DoesNotExist:
            friends = []
            
        return Response({"user":personSerializer.data, "friends":friends, "posts":posts, "comments":comments}, status=status.HTTP_200_OK)
    except Person.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

# Sign Up function
# -----------------------------------------------
@api_view(['POST'])
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        # -- user data & hash password
        req_dict = request.data
        req_dict['password'] = hashPwd(req_dict['password'])
        req_dict['slug'] = req_dict['first_name'].lower().split()[-1] + str(randrange(1111,9999))
        req_dict['created'] = datetime.now().timestamp()
        req_dict['updated'] = datetime.now().timestamp()
        personSerializer = PersonSerializer(data=req_dict)
        # -- check if data is without bad actors
        if personSerializer.is_valid():
            personSerializer.save()
            # -- assign an auth token
            token = genToken()
            Token(
                token=token,
                account=Person.objects.get(email=req_dict['email']).id,
                created=datetime.now(pytz.utc)
                ).save()
            return Response(data={**tokenResponse(token),**personSerializer.data},status=status.HTTP_201_CREATED)
        else:
            return Response(data=personSerializer.errors,status=status.HTTP_400_BAD_REQUEST)

# Log In function, requires email and password
# -----------------------------------------------
@api_view(['POST'])
def login(request):
    email = request.data['email']
    password = request.data['password']
    # -- Check if credentials are correct
    try:
        user = Person.objects.get(email=email)
        if bcrypt.checkpw(password.encode('utf-8'),user.password.encode('utf-8')) == False:
            return Response(data=errorResponse("Credentials are invalid"),status=status.HTTP_403_FORBIDDEN)
    except Person.DoesNotExist:
        return Response(data=errorResponse("Credentials are invalid"),status=status.HTTP_403_FORBIDDEN)
    # -- Assign an auth token
    try:
        token_row = Token.objects.get(account=user.id)
        token = token_row.token
        if checkIfOldToken(token_row.created):
            deleteToken(token)
            raise Token.DoesNotExist
    except Token.DoesNotExist:
        token = genToken()
        Token(
                token=token,
                account=user.id,
                created=datetime.now(pytz.utc)
            ).save()
    return Response(data={**tokenResponse(token),**PersonSerializer(user).data},status=status.HTTP_202_ACCEPTED)

# Log Out function, requires token
# -----------------------------------------------
@api_view(['DELETE'])
def logout(request):
    token = request.headers['Authorization'].split()[-1]
    deleteToken(token)
    return Response(data=json.loads('{"action": "success"}'),status=status.HTTP_200_OK)

# Helper Functions
# -----------------------------------------------
def getPersonID(request):
    try:
        token = request.headers['Authorization'].split()[-1]
    except KeyError:
        return Response(errorResponse(UNAUTHORIZED),status=status.HTTP_401_UNAUTHORIZED)
    try:
        return Token.objects.get(token=token).account
    except Token.DoesNotExist:
        return Response(errorResponse(INVALID_TOKEN),status=status.HTTP_400_BAD_REQUEST)

def checkIfOldToken(date):
    gap = datetime.now(tz=pytz.utc) - date
    print(gap)
    # -- If token is more than 1 day old
    if gap > timedelta(days=1):
        return True
    return False

def deleteToken(token):
    Token.objects.filter(token=token).delete()

def errorResponse(message):
    return json.loads('{"error": ["' + message + '"]}')

def tokenResponse(token):
    return json.loads('{"token": "' + str(token) + '"}')

def hashPwd(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def genToken():
    return token_hex(24)