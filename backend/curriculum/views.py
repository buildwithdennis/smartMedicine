from rest_framework import viewsets, permissions
from .models import Level, Course, Discipline
from .serializers import LevelSerializer, CourseSerializer, DisciplineSerializer

class LevelViewSet(viewsets.ModelViewSet):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Level.objects.all()
        return Level.objects.filter(is_active=True)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['level']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Course.objects.all()
        return Course.objects.filter(is_active=True)

class DisciplineViewSet(viewsets.ModelViewSet):
    queryset = Discipline.objects.all()
    serializer_class = DisciplineSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['course']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Discipline.objects.all()
        return Discipline.objects.filter(is_active=True)
