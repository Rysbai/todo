from django.db import models


class ToDo(models.Model):
    user = models.ForeignKey('app.User', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField()
    start_at = models.DateTimeField()
    finish_at = models.DateTimeField()
    is_done = models.BooleanField(default=False)
