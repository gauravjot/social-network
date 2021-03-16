from django.db import models

# Create your models here.
class Notification(models.Model):
    # seen: 0 (not-seen) or 1 (seen)
    seen = models.IntegerField()

    # noti: notification type _> 0: like, 1: comment, 2: new post, 3: friend req
    noti = models.IntegerField()

    person_for = models.IntegerField()
    person_from = models.IntegerField()

    # about: _> 0: post, 1: friend
    about = models.IntegerField()

    def __str__(self):
        return "Notification #"+str(self.pk)+" __for "+str(self.person_for)+" __from "+str(self.person_from)