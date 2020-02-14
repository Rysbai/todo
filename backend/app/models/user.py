import jwt

from django.db import models
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)


class UserManager(BaseUserManager):
    def create_user(self, name, surname, username, email, password, *args, **kwargs):
        user = self.model(
            username=username,
            email=self.normalize_email(email),
            name=name,
            surname=surname,
            *args,
            **kwargs
        )
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, password, email='None', *args, **kwargs):
        user = self.create_user(username, email, password, *args, **kwargs)
        user.is_admin = True
        user.is_staff = True
        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=200)
    surname = models.CharField(max_length=200)
    email = models.EmailField()
    username = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_email_confirmed = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'

    objects = UserManager()

    def __str__(self):
        return self.username

    @property
    def token(self):
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        dt = datetime.now() + timedelta(days=settings.TOKEN_LIVE_DAYS)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token.decode('utf-8')
