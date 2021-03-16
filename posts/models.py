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
    created = models.FloatField()
    updated = models.FloatField()

    def __str__(self):
        return "Post "+str(self.pk) + ", by " + str(self.person_id)


class Comment(models.Model):
    # comment_parent if equal to pk then comment is top level comment
    post_id = models.IntegerField()
    person_id = models.IntegerField()
    comment_text = models.TextField(blank=False)
    comment_likes = models.JSONField(default=dict)
    comment_parent = models.IntegerField()
    created = models.FloatField()
    updated = models.FloatField()

    def __str__(self):
        return "Comment #"+str(self.pk)+" __by "+str(self.person_id)