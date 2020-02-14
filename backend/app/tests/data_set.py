from django.utils import timezone


class UserTestDataSet:
    def __init__(
            self,
            id=None,
            username='username',
            email='email@mail.ru',
            name='name',
            surname='surname',
            is_admin=False,
            is_staff=False,
            created_at=timezone.now(),
            is_email_confirmed=False,
            password='password'
    ):
        self.id = id
        self.username = username
        self.email = email
        self.name = name
        self.surname = surname
        self.is_admin = is_admin
        self.is_staff = is_staff
        self.created_at = created_at
        self.is_email_confirmed = is_email_confirmed
        self.password = password
