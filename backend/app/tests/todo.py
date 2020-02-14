from datetime import timedelta

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status

from app.factories.user import UserFactory
from app.factories.todo import ToDoFactory
from app.tests.data_set import ToDoTestDataSet

TOKEN_PREFIX = "Bearer"


class ToDoAPITest(TestCase):
    def equal_to_do_dicts(self, first, second):
        self.assertEqual(first['name'], second['name'])
        self.assertEqual(first['is_done'], second['is_done'])

        if first.get('id', None) and second.get('id', None):
            self.assertEqual(first['id'], second['id'])

    def test_should_return_all_logged_user_todos(self):
        user = UserFactory()
        user.is_email_confirmed = True
        user.save()
        todos = ToDoFactory.create_many(user)

        path = reverse('app:todos_list_create')
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + user.token
        }

        response = self.client.get(path, **headers)
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(body), len(todos))

    def test_should_order_by_finish_at(self):
        todos_count = 20
        user = UserFactory()
        user.is_email_confirmed = True
        user.save()
        todos = ToDoFactory.create_many(user, count=todos_count)
        todos = todos.order_by('finish_at')

        path = reverse('app:todos_list_create')
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + user.token
        }

        response = self.client.get(path, **headers)
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for i in range(todos_count):
            self.equal_to_do_dicts(todos[i].__dict__, body[i])

    def test_should_return_only_is_not_done_tasks_if_i_add_actual_true_to_query_param(self):
        todos_count = 20
        user = UserFactory()
        user.is_email_confirmed = True
        user.save()
        ToDoFactory.create_many(user, is_done=True, count=todos_count)

        path = reverse('app:todos_list_create') + '?actual=True'
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + user.token
        }

        response = self.client.get(path, **headers)
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(body), 0)

    def test_should_return_only_not_overdue_tasks_if_i_add_actual_true_to_query_param(self):
        finished_minute_before = timezone.now() - timedelta(minutes=1)
        user = UserFactory()
        user.is_email_confirmed = True
        user.save()
        ToDoFactory(user=user, finish_at=finished_minute_before)

        path = reverse('app:todos_list_create') + '?actual=True'
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + user.token
        }

        response = self.client.get(path, **headers)
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(body), 0)

    def test_should_raise_error_if_user_unauthorized(self):
        invalid_token = 'efierngilewrglewgbh'
        path = reverse('app:todos_list_create') + '?actual=True'
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + invalid_token
        }

        response = self.client.get(path, **headers)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_should_create_todo_if_body_is_valid(self):
        user = UserFactory(is_email_confirmed=True)
        test_data_set = ToDoTestDataSet(user.id)

        path = reverse('app:todos_list_create')
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + user.token
        }
        data = test_data_set.__dict__

        response = self.client.post(path, data=data, **headers)
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.equal_to_do_dicts(data, body)

    def test_should_raise_error_at_create_todo_if_user_unauthorized(self):
        user = UserFactory(is_email_confirmed=True)
        test_data_set = ToDoTestDataSet(user.id)

        data = test_data_set.__dict__
        invalid_token = 'efierngilewrglewgbh'
        path = reverse('app:todos_list_create') + '?actual=True'
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + invalid_token
        }

        response = self.client.post(path, data, **headers)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_should_raise_error_at_create_todo_if_user_email_is_not_confirmed(self):
        user = UserFactory(is_email_confirmed=False)
        test_data_set = ToDoTestDataSet(user.id)

        path = reverse('app:todos_list_create')
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + user.token
        }
        data = test_data_set.__dict__

        response = self.client.post(path, data=data, **headers)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_should_return_user_todos_if_user_is_admin(self):
        admin_user = UserFactory(
            is_admin=True,
            is_email_confirmed=True
        )
        simple_user = UserFactory(is_email_confirmed=True)
        todos_count = 20
        ToDoFactory.create_many(simple_user, count=todos_count)

        path = reverse('app:users_todos', args=[simple_user.id])
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + admin_user.token
        }

        response = self.client.get(path, **headers)
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(body), todos_count)

    def test_should_update_todo_if_data_is_valid(self):
        user = UserFactory(is_email_confirmed=True)
        todo = ToDoFactory(user=user)

        test_body = ToDoTestDataSet(**todo.__dict__)
        data = test_body.__dict__
        data['name'] = 'new Name'

        path = reverse('app:todos_retrieve_update', args=[todo.id])
        headers = {
            "HTTP_AUTHORIZATION": TOKEN_PREFIX + ' ' + user.token
        }

        response = self.client.put(path, data=data, **headers, content_type='application/json')
        body = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(body['name'], 'new Name')

