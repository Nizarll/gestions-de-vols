from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'aircrafts', views.AircraftViewSet, basename='aircraft')
router.register(r'flights', views.FlightViewSet, basename='flight')
router.register(r'bookings', views.BookingViewSet, basename='booking')

urlpatterns = [
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/me/', views.current_user, name='current_user'),
    path('auth/refresh/', views.refresh_token, name='refresh_token'),
    path('auth/logout/', views.logout, name='logout'),
    path('', include(router.urls)),
]
