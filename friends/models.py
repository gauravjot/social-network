from django.db import models

# Create your models here.
class Friend(models.Model):

    user_a = models.IntegerField()
    user_b = models.IntegerField()
    since = models.FloatField()

    def __str__(self):
        return "id:"+str(self.pk) + ", " + self.user_a + " w/ " + self.user_b+ ", " + self.since

class FriendRequest(models.Model):
    from_user = models.IntegerField()
    to_user = models.IntegerField()
    since = models.FloatField()

    def __str__(self):
        return "from user: "+str(self.from_user)+" to user: " +str(self.to_user)+" - " +str(self.accepted)