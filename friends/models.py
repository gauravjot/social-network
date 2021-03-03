from django.db import models

# Create your models here.
class Friend(models.Model):

    user_a = models.IntegerField()
    user_b = models.IntegerField()
    since = models.FloatField()

    def __str__(self):
        return "id: "+str(self.pk) + " => " + str(self.user_a) + " w/ " + str(self.user_b)

class FriendRequest(models.Model):
    from_user = models.IntegerField()
    to_user = models.IntegerField()
    since = models.FloatField()

    def __str__(self):
        return "from user: "+str(self.from_user)+" to user: " +str(self.to_user)