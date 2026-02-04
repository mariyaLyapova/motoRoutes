from rest_framework import serializers
from .models import Route, Location, Image, Comment
from users.serializers import UserSerializer


class ImageSerializer(serializers.ModelSerializer):
    """
    Serializer for Image model.
    """
    uploader = UserSerializer(read_only=True)
    uploader_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Image
        fields = [
            'id',
            'image',
            'caption',
            'route',
            'location',
            'uploader',
            'uploader_id',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'uploader']

    def to_internal_value(self, data):
        """Override to handle string-to-integer conversion for ForeignKey fields from FormData."""
        # Make a mutable copy of the data
        if hasattr(data, '_mutable'):
            data._mutable = True

        # Convert route from string to int if present
        if 'route' in data and data['route']:
            try:
                data['route'] = int(data['route'])
            except (ValueError, TypeError):
                pass  # Let the parent validation handle the error

        # Convert location from string to int if present
        if 'location' in data and data['location']:
            try:
                data['location'] = int(data['location'])
            except (ValueError, TypeError):
                pass  # Let the parent validation handle the error

        return super().to_internal_value(data)


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Comment model.
    """
    author = UserSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Comment
        fields = [
            'id',
            'text',
            'route',
            'author',
            'author_id',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'author']


class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer for Location (POI) model.
    """
    creator = UserSerializer(read_only=True)
    creator_id = serializers.IntegerField(write_only=True, required=False)
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Location
        fields = [
            'id',
            'name',
            'description',
            'location_type',
            'latitude',
            'longitude',
            'route',
            'creator',
            'creator_id',
            'images',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'creator']


class RouteSerializer(serializers.ModelSerializer):
    """
    Serializer for Route model.
    """
    creator = UserSerializer(read_only=True)
    creator_id = serializers.IntegerField(write_only=True, required=False)
    locations = LocationSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    # Count fields
    locations_count = serializers.SerializerMethodField()
    images_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Route
        fields = [
            'id',
            'title',
            'description',
            'difficulty',
            'geojson',
            'distance',
            'duration_days',
            'creator',
            'creator_id',
            'locations',
            'images',
            'comments',
            'locations_count',
            'images_count',
            'comments_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'creator']

    def get_locations_count(self, obj):
        return obj.locations.count()

    def get_images_count(self, obj):
        return obj.images.count()

    def get_comments_count(self, obj):
        return obj.comments.count()


class RouteListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for listing routes.
    Doesn't include nested data for better performance.
    """
    creator = UserSerializer(read_only=True)
    locations_count = serializers.SerializerMethodField()
    images_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Route
        fields = [
            'id',
            'title',
            'description',
            'difficulty',
            'distance',
            'duration_days',
            'creator',
            'locations_count',
            'images_count',
            'comments_count',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'creator']

    def get_locations_count(self, obj):
        return obj.locations.count()

    def get_images_count(self, obj):
        return obj.images.count()

    def get_comments_count(self, obj):
        return obj.comments.count()


class RouteCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating routes.
    Simplified without nested data.
    """
    class Meta:
        model = Route
        fields = [
            'title',
            'description',
            'difficulty',
            'geojson',
            'distance',
            'duration_days',
        ]

    def validate_geojson(self, value):
        """
        Validate GeoJSON format.
        """
        if not isinstance(value, dict):
            raise serializers.ValidationError("GeoJSON must be a valid JSON object.")

        if 'type' not in value:
            raise serializers.ValidationError("GeoJSON must have a 'type' field.")

        if 'coordinates' not in value:
            raise serializers.ValidationError("GeoJSON must have a 'coordinates' field.")

        return value
