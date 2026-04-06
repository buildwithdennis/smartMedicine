from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .admin_views import (
    AdminDashboardStatsView,
    AdminStudentViewSet,
    AdminPlatformActivityViewSet
)

router = DefaultRouter()
router.register(r'students', AdminStudentViewSet, basename='admin-students')
router.register(r'activity', AdminPlatformActivityViewSet, basename='admin-activity')

urlpatterns = [
    path('stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('', include(router.urls)),
]
