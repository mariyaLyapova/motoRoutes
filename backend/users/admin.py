from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin interface for custom User model.
    """
    list_display = ['username', 'email', 'first_name', 'last_name', 'motorcycle_brand', 'motorcycle_model', 'created_at']
    list_filter = ['is_staff', 'is_superuser', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'motorcycle_brand']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {
            'fields': ('bio', 'avatar')
        }),
        ('Motorcycle Info', {
            'fields': ('motorcycle_brand', 'motorcycle_model', 'motorcycle_year')
        }),
    )
