from django.db import models
from django.utils import timezone

# Create your models here.
class Posts(models.Model):
    person_id = models.IntegerField()
    post_text = models.TextField()
    post_image = models.URLField(default="")
    likes = models.JSONField(default={"persons":[]})
    created = models.DateTimeField(default=timezone.now)
    updated = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return "post id:"+str(self.pk) + ", by person: " + str(self.person)