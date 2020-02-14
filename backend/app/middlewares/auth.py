import jwt
from datetime import datetime

from django.conf import settings
from rest_framework import authentication, exceptions

from app.models import User


class JWTAuthentication(authentication.BaseAuthentication):
    authentication_header_prefix = 'Bearer'

    def authenticate(self, request):
        request.user = None

        auth_header = authentication.get_authorization_header(request).split()
        auth_header_prefix = self.authentication_header_prefix.lower()

        if not auth_header:
            return None

        if len(auth_header) == 1:
            return None

        elif len(auth_header) > 2:
            return None

        prefix = auth_header[0].decode('utf-8')
        token = auth_header[1].decode('utf-8')

        if prefix.lower() != auth_header_prefix:
            return None

        return self._authenticate_credentails(request, token)

    def _authenticate_credentails(self, request, token):

        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
        except Exception:
            raise exceptions.AuthenticationFailed('user.token.invalid')

        try:
            user = User.objects.get(pk=payload['id'])
        except Exception:
            raise exceptions.AuthenticationFailed('user.not_found')

        if payload['exp'] < int(datetime.now().strftime('%s')):
            raise exceptions.AuthenticationFailed('user.token.expired')

        return (user, token)
