from rest_framework import permissions


class BaseUserPermissions(permissions.BasePermission):
    """
    Handles permissions for users.  The basic rules are

     - owner may GET, PUT, POST, DELETE
     - nobody else can access
     """

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True

        # check if user is owner
        return request.user == obj.user

class BaseTransactionPermissions(permissions.BasePermission):
    """
    Handles permissions for users.  The basic rules are

     - owner may GET, PUT, POST, DELETE
     - nobody else can access
     """
    def has_permission(self, request, view):
        return request.user

    def has_object_permission(self, request, view, obj):
        # check if user is owner
        return request.user == obj.requester or request.user == obj.respondent