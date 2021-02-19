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
@api_view(['GET'])
def personInfo(request, pk):
    try:
        data = Person.objects.get(pk=pk)
        personSerializer = PersonSerializer(data)
        return Response(personSerializer.data, status=status.HTTP_200_OK)
    except Person.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

# Sign Up function
@api_view(['POST'])
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        req_dict = request.data
        req_dict['password'] = hashPwd(req_dict['password'])
        personSerializer = PersonSerializer(data=req_dict)

        if personSerializer.is_valid():
            personSerializer.save()
            token = genToken()
            Token(
                token=token,
                account=Person.objects.get(email=req_dict['email']).id
                ).save()
            return Response(data=tokenResponse(token),status=status.HTTP_201_CREATED)
        else:
            return Response(data=personSerializer.errors,status=status.HTTP_400_BAD_REQUEST)

# Log In function, requires email and password
@api_view(['POST'])
def login(request):
    email = request.data['email']
    password = request.data['password']

    try:
        user = Person.objects.get(email=email)
        if bcrypt.checkpw(password.encode('utf-8'),user.password.encode('utf-8')) == False:
            return Response(data=errorResponse("Credentials are invalid"),status=status.HTTP_403_FORBIDDEN)
    except Person.DoesNotExist:
        return Response(data=errorResponse("Credentials are invalid"),status=status.HTTP_403_FORBIDDEN)
    try:
        token = Token.objects.get(account=user.id).token
    except Token.DoesNotExist:
        token = genToken()
        print(token)
        Token(
                token=token,
                account=user.id
            ).save()
    return Response(data=tokenResponse(token),status=status.HTTP_202_ACCEPTED)


# Helper Functions

def errorResponse(message):
    return json.loads('{"error": ["' + message + '"]}')

def tokenResponse(token):
    return json.loads('{"token": "' + str(token) + '"}')

def hashPwd(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def genToken():
    return token_hex(24)