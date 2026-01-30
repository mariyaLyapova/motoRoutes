from django.contrib import admin
from .models import Route, Location, Image, Comment


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    """
    Admin interface for Route model.
    """
    list_display = ['title', 'creator', 'difficulty', 'distance', 'created_at']
    list_filter = ['difficulty', 'created_at']
    search_fields = ['title', 'description', 'creator__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    """
    Admin interface for Location model.
    """
    list_display = ['name', 'location_type', 'route', 'creator', 'created_at']
    list_filter = ['location_type', 'created_at']
    search_fields = ['name', 'description', 'creator__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    """
    Admin interface for Image model.
    """
    list_display = ['id', 'caption', 'route', 'location', 'uploader', 'created_at']
    list_filter = ['created_at']
    search_fields = ['caption', 'uploader__username']
    readonly_fields = ['created_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """
    Admin interface for Comment model.
    """
    list_display = ['id', 'author', 'route', 'created_at']
    list_filter = ['created_at']
    search_fields = ['text', 'author__username', 'route__title']
    readonly_fields = ['created_at', 'updated_at']
