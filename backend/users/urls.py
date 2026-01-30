from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('', views.UserListView.as_view(), name='user-list'),
]
