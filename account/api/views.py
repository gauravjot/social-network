from datetime import datetime, timedelta
import pytz
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import PersonSerializer
from account.models import Person, Token

import json
import bcrypt
from secrets import token_hex

# Get profile info
# -----------------------------------------------
@api_view(['GET'])
def personInfo(request, pk):
    try:
        data = Person.objects.get(pk=pk)
        personSerializer = PersonSerializer(data)
        return Response(personSerializer.data, status=status.HTTP_200_OK)
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
            return Response(data=tokenResponse(token),status=status.HTTP_201_CREATED)
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
        personSerializer = PersonSerializer(user)
    return Response(data={**tokenResponse(token),**personSerializer.data},status=status.HTTP_202_ACCEPTED)

@api_view(['DELETE'])
def logout(request):
    token = request.headers['Authorization'].split()[-1]
    deleteToken(token)
    return Response(data=json.loads('{"action": "success"}'),status=status.HTTP_200_OK)

# Helper Functions
# -----------------------------------------------
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