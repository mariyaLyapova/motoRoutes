from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Stores user profile information and motorcycle details.
    """

    # Profile information
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    # Motorcycle information
    motorcycle_brand = models.CharField(max_length=100, blank=True)
    motorcycle_model = models.CharField(max_length=100, blank=True)
    motorcycle_year = models.IntegerField(blank=True, null=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']

    def __str__(self):
        return self.username
