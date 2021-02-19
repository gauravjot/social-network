from django.db import models
import datetime

# Create your models here.
class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=100)
    avatar = models.URLField()
    birthday = models.CharField(max_length=10)
    tagline = models.CharField(max_length=200)
    created = models.DateTimeField(default=datetime.datetime.now())
    updated = models.DateTimeField(default=datetime.datetime.now())

    def __str__(self):
        return "id:"+str(self.pk) + ", " + self.first_name + " " + self.last_name+ ", " + self.email

class Token(models.Model):
    token = models.CharField(max_length=100)
    account = models.IntegerField()
    created = models.DateTimeField(default=datetime.datetime.now())

    def __str__(self):
        return "person_id: "+str(self.account)