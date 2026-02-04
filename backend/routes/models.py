from django.db import models
from django.conf import settings


class Route(models.Model):
    """
    Motorcycle route with GeoJSON path data.
    """
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('hard', 'Hard'),
        ('expert', 'Expert'),
    ]

    # Basic information
    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='moderate')

    # Route data
    geojson = models.JSONField(help_text="GeoJSON LineString data for the route path")
    distance = models.FloatField(help_text="Distance in kilometers")
    duration_days = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Trip duration in days"
    )

    # Relationships
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='routes')

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'routes'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Location(models.Model):
    """
    Point of Interest (POI) on a route.
    """
    LOCATION_TYPE_CHOICES = [
        ('gas_station', 'Gas Station'),
        ('restaurant', 'Restaurant'),
        ('viewpoint', 'Viewpoint'),
        ('hotel', 'Hotel'),
        ('rest_area', 'Rest Area'),
        ('attraction', 'Attraction'),
        ('parking', 'Parking'),
        ('other', 'Other'),
    ]

    # Basic information
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    location_type = models.CharField(max_length=50, choices=LOCATION_TYPE_CHOICES)

    # Geographic data
    latitude = models.FloatField()
    longitude = models.FloatField()

    # Relationships
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='locations', null=True, blank=True)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='locations')

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'locations'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Image(models.Model):
    """
    Images attached to routes or locations.
    """
    # Image file
    image = models.ImageField(upload_to='route_images/')
    caption = models.CharField(max_length=200, blank=True)

    # Relationships (can be attached to route OR location)
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='images', null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='images', null=True, blank=True)
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='images')

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'images'
        ordering = ['-created_at']

    def __str__(self):
        if self.route:
            return f"Image for {self.route.title}"
        elif self.location:
            return f"Image for {self.location.name}"
        return f"Image {self.id}"


class Comment(models.Model):
    """
    Comments on routes.
    """
    # Comment content
    text = models.TextField()

    # Relationships
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'comments'
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.author.username} on {self.route.title}"
