from django.urls import path
from . import views

urlpatterns = [
    # Route endpoints
    path('', views.RouteListCreateView.as_view(), name='route-list-create'),
    path('<int:pk>/', views.RouteDetailView.as_view(), name='route-detail'),
    path('user/<int:user_id>/', views.UserRoutesView.as_view(), name='user-routes'),
    path('<int:route_id>/locations/', views.RouteLocationsView.as_view(), name='route-locations'),
    path('<int:route_id>/comments/', views.RouteCommentsView.as_view(), name='route-comments'),

    # Location endpoints
    path('locations/', views.LocationListCreateView.as_view(), name='location-list-create'),
    path('locations/<int:pk>/', views.LocationDetailView.as_view(), name='location-detail'),

    # Image endpoints
    path('images/', views.ImageListCreateView.as_view(), name='image-list-create'),
    path('images/<int:pk>/', views.ImageDetailView.as_view(), name='image-detail'),

    # Comment endpoints
    path('comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
]
