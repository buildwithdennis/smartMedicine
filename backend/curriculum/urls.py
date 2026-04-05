from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LevelViewSet, CourseViewSet, DisciplineViewSet

router = DefaultRouter()
router.register('levels', LevelViewSet, basename='level')
router.register('courses', CourseViewSet, basename='course')
router.register('disciplines', DisciplineViewSet, basename='discipline')

urlpatterns = [
    path('', include(router.urls)),
]
