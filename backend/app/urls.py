from django.urls import path

from app.views.todo import ToDoListCreateAPIView, ToDoRetrieveUpdateDeleteView
from app.views.user import RegistrationAPIView, LoginAPIView, UserListView, RetrieveCurrentUserAPIView


urlpatterns = [
    path('users', UserListView.as_view()),
    path('users/registration', RegistrationAPIView.as_view()),
    path('users/login', LoginAPIView.as_view()),
    path('users/current', RetrieveCurrentUserAPIView.as_view()),

    path('todos', ToDoListCreateAPIView.as_view()),
    path('todos/<int:pk>', ToDoRetrieveUpdateDeleteView.as_view()),
]
