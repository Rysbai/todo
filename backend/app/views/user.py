from datetime import datetime

import jwt
from django.conf import settings
from django.core.mail import send_mail
from django.http import Http404
from django.template import loader, Template, Context
from rest_framework import status, exceptions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from app.models import User
from app.serializers.user import RegistrationSerializer, LoginSerializer, UserSerializer
from app.views.permissions import IsAdminUser, IsUserEmailConfirmed, IsOwnerOfToDo


class RegistrationAPIView(APIView):
    permission_classes = (AllowAny, )
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        self._send_confirm_link(serializer.data['token'], serializer.data['email'])

        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    def _send_confirm_link(self, token: str, email: str):
        subject = 'ToDo'
        context = {
            'url': settings.HOST_NAME + '/confirm_email/' + token
        }
        send_mail(
            subject=subject,
            message=None,
            html_message=loader.render_to_string(
                "app/email.html",
                context
            ),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=True
        )


class LoginAPIView(APIView):
    permission_classes = (AllowAny, )
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        user = request.data

        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class EmailConfirmView(APIView):
    permission_classes = (AllowAny, )

    def get(self, request, token, *args, **kwargs):
        user = self._get_valid_user(token)
        user.is_email_confirmed = True
        user.save()

        return Response(data=None, status=status.HTTP_204_NO_CONTENT)

    def _get_valid_user(self, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY)
        except:
            raise Http404

        try:
            user = User.objects.get(pk=payload['id'])
        except:
            raise Http404

        if payload['exp'] < int(datetime.now().strftime('%s')):
            raise exceptions.AuthenticationFailed('user.token.expired')

        return user


class UserListView(ListAPIView):
    permission_classes = (IsAuthenticated, IsUserEmailConfirmed, IsAdminUser, )
    queryset = User.objects.filter(is_admin=False)
    serializer_class = UserSerializer


class RetrieveCurrentUserAPIView(APIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(user)

        return Response(data=serializer.data, status=status.HTTP_200_OK)

