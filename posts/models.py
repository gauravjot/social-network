from django.db import models
import datetime


def upload_path(instance, filename):
    return '/'.join(['posts', str(instance.person_id), str(instance.created), filename])

# Create your models here.
class Posts(models.Model):
    person_id = models.IntegerField()
    post_text = models.TextField()
    post_image = models.ImageField(blank=True, null=True, upload_to=upload_path)
    likes = models.JSONField(default=dict)
    created = models.FloatField(default=datetime.datetime.now().timestamp())
    updated = models.FloatField(default=datetime.datetime.now().timestamp())

    def __str__(self):
        return "Post "+str(self.pk) + ", by " + str(self.person_id)
