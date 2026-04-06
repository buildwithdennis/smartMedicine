from rest_framework import serializers
from django.contrib.auth import get_user_model
from curriculum.models import Level, Course, Discipline
from practice.models import Session
from questions.models import Question

User = get_user_model()

class AdminStudentSerializer(serializers.ModelSerializer):
    level_name = serializers.CharField(source='profile.level.name', read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'registration_id', 'role', 'level_name', 'date_joined']

class AdminSessionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    level_name = serializers.CharField(source='level.name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    
    class Meta:
        model = Session
        fields = [
            'id', 'user_name', 'session_type', 'status', 
            'level_name', 'course_name', 'total_questions', 
            'score', 'start_time', 'end_time'
        ]

class DashboardStatsSerializer(serializers.Serializer):
    total_students = serializers.IntegerField()
    total_courses = serializers.IntegerField()
    total_questions = serializers.IntegerField()
    active_sessions = serializers.IntegerField()
    completion_rate = serializers.FloatField()
