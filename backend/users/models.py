from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Stores user profile information and motorcycle details.
    """

    MOTORCYCLE_TYPE_CHOICES = [
        ('sport', 'Sport'),
        ('cruiser', 'Cruiser'),
        ('touring', 'Touring'),
        ('adventure', 'Adventure'),
        ('naked', 'Naked/Standard'),
        ('dual_sport', 'Dual Sport'),
        ('scooter', 'Scooter'),
        ('cafe_racer', 'Cafe Racer'),
        ('scrambler', 'Scrambler'),
        ('other', 'Other'),
    ]

    # Profile information
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    country = models.CharField(max_length=100, blank=True)

    # Motorcycle information
    motorcycle_type = models.CharField(max_length=50, choices=MOTORCYCLE_TYPE_CHOICES, blank=True)
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
