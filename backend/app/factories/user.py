import factory
from django.db.models.signals import post_save


from app.models.user import User


@factory.django.mute_signals(post_save)
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    name = 'Example name'
    surname = 'Example surname'
    email = factory.Sequence(lambda n: 'email_{0}@mail.ru'.format(n))
    username = factory.Sequence(lambda n: 'username_{0}'.format(n))

    @staticmethod
    def create_many(count=10):
        users = []
        for i in range(count):
            users.append(UserFactory())

        return users

