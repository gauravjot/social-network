from django.db import models
import datetime


# Create your models here.
class Posts(models.Model):
    current_time = datetime.datetime.now().timestamp()
    person_id = models.IntegerField()
    post_text = models.TextField()
    post_image = models.URLField(default="")
    likes = models.JSONField(default=dict)
    created = models.DateTimeField(default=current_time)
    updated = models.DateTimeField(default=current_time)

    def __str__(self):
        return "post id:"+str(self.pk) + ", by person: " + str(self.person)
