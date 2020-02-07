from rest_framework import serializers
from django.contrib.auth import authenticate

from app.models import User


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=128,
        min_length=8,
        write_only=True
    )
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'name', 'surname', 'email', 'username',
            'created_at', 'password', 'token', 'is_admin']
        read_only_fields = ('created_at', 'token')


    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(max_length=255, read_only=True)
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)

    def validate(self, data):
        username = data.get('username', None)
        password = data.get('password', None)

        if username is None:
            raise serializers.ValidationError(
                'user.email.required'
            )
        if password is None:
            raise serializers.ValidationError(
                'user.password.required'
            )

        user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError(
                'user.notFound'
            )

        if not user.is_email_confirmed:
            raise serializers.ValidationError(
                'user.email.notConfirmed'
            )

        return {
            'email': user.email,
            'username': user.username,
            'token': user.token
        }


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id', 'name', 'surname', 'email', 'username',
            'created_at', 'password', 'is_admin'
        )
