from django.urls import path

from app.views.todo import ToDoListCreateAPIView, ToDoRetrieveUpdateDeleteView, UserToDosListView
from app.views.user import (
    RegistrationAPIView,
    LoginAPIView,
    UserListView,
    RetrieveCurrentUserAPIView,
    EmailConfirmView
)

app_name = 'app'
urlpatterns = [
    path('users', UserListView.as_view(), name='users_list'),
    path('users/signup', RegistrationAPIView.as_view(), name='users_sign_up'),
    path('users/confirm_email/<str:token>', EmailConfirmView.as_view(), name='users_confirm_email'),
    path('users/login', LoginAPIView.as_view(), name='users_login'),
    path('users/current', RetrieveCurrentUserAPIView.as_view(), name='users_current'),

    path('users/<int:user_pk>/todos', UserToDosListView.as_view(), name='users_todos'),
    path('todos', ToDoListCreateAPIView.as_view(), name='todos_list_create'),
    path('todos/<int:pk>', ToDoRetrieveUpdateDeleteView.as_view(), name='todos_retrieve_update'),
]
