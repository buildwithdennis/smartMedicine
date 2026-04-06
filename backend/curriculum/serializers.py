from rest_framework import serializers
from .models import Level, Course, Discipline

class DisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discipline
        fields = ('id', 'course', 'name', 'is_active')

class CourseSerializer(serializers.ModelSerializer):
    disciplines = DisciplineSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ('id', 'level', 'name', 'code', 'is_active', 'disciplines')

class LevelSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Level
        fields = ('id', 'name', 'order', 'is_active', 'courses')
