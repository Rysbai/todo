import factory
from datetime import timedelta
from django.db.models.signals import post_save
from django.utils import timezone

from app.models.todo import ToDo


@factory.django.mute_signals(post_save)
class ToDoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ToDo

    user = factory.SubFactory('app.factories.user.UserFactory', todo=None)
    name = 'Example name'
    description = 'Example description'
    start_at = timezone.now()
    finish_at = timezone.now() + timedelta(days=1)
    is_done = False

    @staticmethod
    def create_many(user, is_done=False, count=10):
        todo_ids = []
        for i in range(count):
            todo = ToDoFactory(user=user, is_done=is_done, finish_at=timezone.now() + timedelta(days=i))
            todo_ids.append(
                todo.id
            )
        todos = ToDo.objects.filter(pk__in=todo_ids)
        return todos
