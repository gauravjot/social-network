from django.shortcuts import render, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import PersonSerializer
from .models import Person

import json

# Create your views here.
def Index(request):
    return HttpResponse("Hello!")

@api_view(['GET'])
def personInfo(request, pk):
    try:
        data = Person.objects.get(pk=pk)
        personSerializer = PersonSerializer(data)
        return Response(personSerializer.data, status=status.HTTP_200_OK)
    except Person.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        req_dict = request.data

        try:
            user = Person(
                first_name=req_dict['first_name'],
                last_name=req_dict['last_name'],
                email=req_dict['email'],
                password=req_dict['password'],
                avatar=req_dict['avatar'],
                birthday=req_dict['birthday'],
                tagline=req_dict['tagline']
            )
        except KeyError:
            return Response(data=errorResponse("Missing data."),status=status.HTTP_204_NO_CONTENT)

        try:
            user.save()
        except IntegrityError:
            return Response(data=errorResponse("Email already exists."),status=status.HTTP_409_CONFLICT)
        return Response(PersonSerializer(user).data,status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

def errorResponse(message):
    return json.loads('{"error": {"message": "' + message + '"}}')