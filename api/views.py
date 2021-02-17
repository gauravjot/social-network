from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from rest_framework.serializers import Serializer
from .serializers import PersonSerializer
from .models import Person

# Create your views here.
def Index(request):
    return HttpResponse("Hello!")

def account(request, pk):
    data = Person.objects.get(pk=pk)
    personSerializer = PersonSerializer(data)
    return JsonResponse(personSerializer.data, safe=False)
