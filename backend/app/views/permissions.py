from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_admin


class IsOwnerOfToDo(BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsUserEmailConfirmed(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_email_confirmed
