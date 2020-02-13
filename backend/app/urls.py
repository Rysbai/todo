from django.urls import path

from app.views.todo import ToDoListCreateAPIView, ToDoRetrieveUpdateDeleteView, UserToDosListView
from app.views.user import (
    RegistrationAPIView,
    LoginAPIView,
    UserListView,
    RetrieveCurrentUserAPIView,
    EmailConfirmView
)


urlpatterns = [
    path('users', UserListView.as_view()),
    path('users/signup', RegistrationAPIView.as_view()),
    path('users/confirm_email/<str:token>', EmailConfirmView.as_view()),
    path('users/login', LoginAPIView.as_view()),
    path('users/current', RetrieveCurrentUserAPIView.as_view()),

    path('users/<int:user_pk>/todos', UserToDosListView.as_view()),
    path('todos', ToDoListCreateAPIView.as_view()),
    path('todos/<int:pk>', ToDoRetrieveUpdateDeleteView.as_view()),
]
