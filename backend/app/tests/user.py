from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from app.factories.user import UserFactory
from app.tests.data_set import UserTestDataSet

TOKEN_PREFIX = "Bearer"

class UserAPITest(TestCase):
    def equal_user_dicts(self, first, second):
        self.assertEqual(first['username'], second['username'])
        self.assertEqual(first['email'], second['email'])
        self.assertEqual(first['name'], second['name'])
        self.assertEqual(first['is_admin'], second['is_admin'])
        self.assertEqual(first['is_email_confirmed'], second['is_email_confirmed'])

    def test_should_sign_up_user(self):
        user_test_entity = UserTestDataSet()
        path = reverse('app:users_sign_up')
        data = user_test_entity.__dict__

        response = self.client.post(path, data=data, content_type='application/json')
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.equal_user_dicts(data, body)

    def test_should_not_email_confirmed(self):
        user_test_entity = UserTestDataSet()
        path = reverse('app:users_sign_up')
        data = user_test_entity.__dict__

        response = self.client.post(path, data=data, content_type='application/json')
        body = response.json()

        self.assertEqual(body['is_email_confirmed'], False)

    def test_should_auth_user_if_login_and_password_is_correct(self):
        password = 'password'
        user = UserFactory()
        user.is_email_confirmed = True
        user.set_password(password)
        user.save()

        path = reverse('app:users_login')
        data = {
            "username": user.username,
            "password": password
        }

        response = self.client.post(path, data=data, content_type='application/json')
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(body['username'], user.username)

    def test_should_raise_error_if_user_email_is_not_confirmed(self):
        password = 'password'
        user = UserFactory()
        user.is_email_confirmed = False
        user.set_password(password)
        user.save()

        path = reverse('app:users_login')
        data = {
            "username": user.username,
            "password": password
        }

        response = self.client.post(path, data=data, content_type='application/json')
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(body['error'][0], 'user.email.notConfirmed')

    def test_should_raise_error_if_user_not_found(self):
        path = reverse('app:users_login')
        data = {
            "username": 'user.username',
            "password": 'password'
        }

        response = self.client.post(path, data=data, content_type='application/json')
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(body['error'][0], 'user.notFound')

    def test_should_confirmed_email_if_token_is_valid(self):
        password = 'password'
        user = UserFactory()
        user.is_email_confirmed = False
        user.set_password(password)
        user.save()

        path = reverse('app:users_confirm_email', args=[user.token])

        response = self.client.get(path)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_should_return_error_if_token_is_invalid(self):
        invalid_token = 'qwertyu890['

        path = reverse('app:users_confirm_email', args=[invalid_token])

        response = self.client.get(path)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_should_return_current_user(self):
        user = UserFactory()

        path = reverse('app:users_current')
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + user.token
        }

        response = self.client.get(path, **headers)
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.equal_user_dicts(body, user.__dict__)

    def test_should_raise_error_if_token_is_invalid(self):
        token = 'fwpfwe'

        path = reverse('app:users_current')
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + token
        }

        response = self.client.get(path, **headers)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_should_return_all_users_except_him_if_user_is_admin(self):
        user = UserFactory()
        user.is_admin = True
        user.is_email_confirmed = True
        user.is_staff = True
        user.save()

        other_users = UserFactory.create_many(10)

        path = reverse('app:users_list')
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + user.token
        }

        response = self.client.get(path, **headers)
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(body), len(other_users))
        for i in range(10):
            self.equal_user_dicts(body[i], other_users[i].__dict__)

    def test_should_raise_error_if_user_unauthorized(self):
        invalid_token = 'qwertyuhdfdasa'

        path = reverse('app:users_list')
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + invalid_token
        }

        response = self.client.get(path, **headers)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_should_raise_error_to_get_all_users_if_user_email_is_not_confirmed(self):
        user = UserFactory()
        user.is_admin = True
        user.is_email_confirmed = False
        user.is_staff = True
        user.save()

        path = reverse('app:users_list')
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + user.token
        }

        response = self.client.get(path, **headers)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_should_raise_error_to_get_users_if_user_is_not_admin(self):
        user = UserFactory()
        user.is_admin = False
        user.is_email_confirmed = True
        user.is_staff = True
        user.save()

        path = reverse('app:users_list')
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + user.token
        }

        response = self.client.get(path, **headers)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

     

