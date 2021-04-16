import datetime
import json
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from helpers.api_error_response import errorResponse
from helpers.error_messages import UNAUTHORIZED, INVALID_TOKEN, INVALID_REQUEST

from notifications.models import Notification
from account.models import Person, Token
from account.api.serializers import PersonSerializer

# seen [0:not-seen, 1:seen]
# noti: notification type [0: like, 1: comment, 2: new post, 3: friend req]
# about [0: post, 1: friend]

@api_view(['GET'])
def getNotifications(request):
    person_id = getPersonID(request)
    if type(person_id) is Response:
        return person_id

    # Get notifications which are at most a day old; or are not seen yet unrelated to time
    notifications = Notification.objects.filter(person_for=person_id).filter(Q(seen=0) | Q(created__range=((datetime.datetime.now() - datetime.timedelta(days=1)).timestamp(),datetime.datetime.now().timestamp()))).values()
    res = []
    for notif in notifications:
        person_by = PersonSerializer(Person.objects.get(pk=notif['person_from'])).data
        res.append({**notif,**{"person":person_by}})
    return Response(data=res, status=status.HTTP_200_OK)

@api_view(['PUT'])
def markAsSeen(request,pk):
    person_id = getPersonID(request)
    if type(person_id) is Response:
        return person_id

    try:
        notification = Notification.objects.get(pk=pk)
        notification.seen = 1
        notification.save()
        return Response(json.loads('{"action":"success"}'),status=status.HTTP_200_OK)
    except Notification.DoesNotExist:
        return Response(errorResponse(INVALID_REQUEST),status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def markAllAsSeen(request):
    person_id = getPersonID(request)
    if type(person_id) is Response:
        return person_id

    unseen_notifications = Notification.objects.filter(seen=0).values()
    for notification in unseen_notifications:    
        notification = Notification.objects.get(pk=notification['id'])
        notification.seen = 1
        notification.save()
    return Response(json.loads('{"action":"success"}'),status=status.HTTP_200_OK)

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