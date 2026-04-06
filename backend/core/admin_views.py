from rest_framework import viewsets, views, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
from curriculum.models import Level, Course, Discipline
from practice.models import Session
from questions.models import Question
from .admin_serializers import (
    AdminStudentSerializer, 
    AdminSessionSerializer,
    DashboardStatsSerializer
)

User = get_user_model()

class AdminDashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_students = User.objects.filter(role='student').count()
        total_courses = Course.objects.count()
        total_questions = Question.objects.count()
        active_sessions = Session.objects.filter(status='IN_PROGRESS').count()
        
        # Calculate completion rate
        completed = Session.objects.filter(status='COMPLETED').count()
        total_sessions = Session.objects.count()
        completion_rate = (completed / total_sessions * 100) if total_sessions > 0 else 0

        data = {
            "total_students": total_students,
            "total_courses": total_courses,
            "total_questions": total_questions,
            "active_sessions": active_sessions,
            "completion_rate": round(completion_rate, 1)
        }
        return Response(data)

class AdminStudentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.filter(role='student').select_related('profile__level').order_by('-date_joined')
    serializer_class = AdminStudentSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminPlatformActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Session.objects.all().select_related('user', 'level', 'course').order_by('-created_at')
    serializer_class = AdminSessionSerializer
    permission_classes = [permissions.IsAdminUser]
