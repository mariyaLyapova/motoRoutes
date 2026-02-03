from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Route, Location, Image, Comment
from .serializers import (
    RouteSerializer,
    RouteListSerializer,
    RouteCreateSerializer,
    LocationSerializer,
    ImageSerializer,
    CommentSerializer
)


# ===== ROUTE VIEWS =====

class RouteListCreateView(generics.ListCreateAPIView):
    """
    API endpoint to list and create routes.
    GET /api/routes/ - List all routes
    POST /api/routes/ - Create new route

    Filters:
    - search: Search by title or description
    - difficulty: Filter by difficulty (easy, moderate, hard, expert)
    """
    queryset = Route.objects.all().select_related('creator').prefetch_related('locations', 'images', 'comments')
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    filterset_fields = ['difficulty']
    ordering_fields = ['created_at', 'distance', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RouteCreateSerializer
        return RouteListSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class RouteDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint to get, update, or delete a route.
    GET /api/routes/<id>/ - Get route details
    PUT/PATCH /api/routes/<id>/ - Update route
    DELETE /api/routes/<id>/ - Delete route
    """
    queryset = Route.objects.all().select_related('creator').prefetch_related('locations', 'images', 'comments')
    serializer_class = RouteSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_update(self, serializer):
        # Only allow creator to update
        if serializer.instance.creator != self.request.user:
            return Response({'error': 'You can only edit your own routes'}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()

    def perform_destroy(self, instance):
        # Only allow creator to delete
        if instance.creator != self.request.user:
            return Response({'error': 'You can only delete your own routes'}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()


class UserRoutesView(generics.ListAPIView):
    """
    API endpoint to list routes by a specific user.
    GET /api/routes/user/<user_id>/
    """
    serializer_class = RouteListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Route.objects.filter(creator_id=user_id).select_related('creator')


# ===== LOCATION VIEWS =====

class LocationListCreateView(generics.ListCreateAPIView):
    """
    API endpoint to list and create locations.
    GET /api/routes/locations/ - List all locations
    POST /api/routes/locations/ - Create new location
    """
    queryset = Location.objects.all().select_related('creator', 'route')
    serializer_class = LocationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class LocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint to get, update, or delete a location.
    GET /api/routes/locations/<id>/
    PUT/PATCH /api/routes/locations/<id>/
    DELETE /api/routes/locations/<id>/
    """
    queryset = Location.objects.all().select_related('creator', 'route')
    serializer_class = LocationSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class RouteLocationsView(generics.ListAPIView):
    """
    API endpoint to list locations for a specific route.
    GET /api/routes/<route_id>/locations/
    """
    serializer_class = LocationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        route_id = self.kwargs['route_id']
        return Location.objects.filter(route_id=route_id).select_related('creator')


# ===== IMAGE VIEWS =====

class ImageListCreateView(generics.ListCreateAPIView):
    """
    API endpoint to list and create images.
    GET /api/routes/images/ - List all images
    POST /api/routes/images/ - Upload new image
    """
    queryset = Image.objects.all().select_related('uploader', 'route', 'location')
    serializer_class = ImageSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)


class ImageDetailView(generics.RetrieveDestroyAPIView):
    """
    API endpoint to get or delete an image.
    GET /api/routes/images/<id>/
    DELETE /api/routes/images/<id>/
    """
    queryset = Image.objects.all().select_related('uploader', 'route', 'location')
    serializer_class = ImageSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


# ===== COMMENT VIEWS =====

class CommentListCreateView(generics.ListCreateAPIView):
    """
    API endpoint to list and create comments.
    GET /api/routes/comments/ - List all comments
    POST /api/routes/comments/ - Create new comment
    """
    queryset = Comment.objects.all().select_related('author', 'route')
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint to get, update, or delete a comment.
    GET /api/routes/comments/<id>/
    PUT/PATCH /api/routes/comments/<id>/
    DELETE /api/routes/comments/<id>/
    """
    queryset = Comment.objects.all().select_related('author', 'route')
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class RouteCommentsView(generics.ListAPIView):
    """
    API endpoint to list comments for a specific route.
    GET /api/routes/<route_id>/comments/
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        route_id = self.kwargs['route_id']
        return Comment.objects.filter(route_id=route_id).select_related('author')
