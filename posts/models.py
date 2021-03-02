from django.db import models
import datetime


# Create your models here.
class Posts(models.Model):
    person_id = models.IntegerField()
    post_text = models.TextField()
    post_image = models.URLField(default="")
    likes = models.JSONField(default=dict)
    created = models.FloatField(default=datetime.datetime.now().timestamp())
    updated = models.FloatField(default=datetime.datetime.now().timestamp())

    def __str__(self):
        return "post id:"+str(self.pk) + ", by person: " + str(self.person)
