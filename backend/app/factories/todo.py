import factory
from django.db.models.signals import post_save
from django.utils import timezone

from app.models.todo import ToDo


@factory.django.mute_signals(post_save)
class ToDoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ToDo

    name = 'Example name'
    description = 'Example description'
    start_at = timezone.now()
    finish_at = timezone.now()
    is_done = False
