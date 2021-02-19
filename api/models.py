from django.db import models

# Create your models here.
class Person(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=48)
    avatar = models.URLField()
    birthday = models.CharField(max_length=10)
    tagline = models.CharField(max_length=200)

    def __str__(self):
        return str(self.first_name + " " + self.last_name+ ", " + self.email)