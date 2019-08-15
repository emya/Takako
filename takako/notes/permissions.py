from rest_framework import permissions


class BaseUserPermissions(permissions.BasePermission):
    """
    Base permission class
    """
    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True

        # check if user is owner
        return request.user == obj.user

class BaseTransactionPermissions(permissions.BasePermission):
    """
    Rermissions for Transaction objects
    """
    def has_object_permission(self, request, view, obj):
        # check if user is owner
        return request.user == obj.requester or request.user == obj.respondent