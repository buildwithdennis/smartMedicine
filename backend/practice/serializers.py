from rest_framework import serializers
from .models import Session, StudentAnswer
from questions.models import Question, QuestionOption
from questions.serializers import QuestionSerializer, QuestionOptionSerializer

class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = ['id', 'question', 'selected_option', 'is_correct', 'response_time', 'created_at']
        read_only_fields = ['is_correct', 'created_at']

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = [
            'id', 'session_type', 'status', 'level', 'course', 
            'discipline', 'start_time', 'end_time', 'total_questions', 
            'score', 'created_at'
        ]
        read_only_fields = ['start_time', 'end_time', 'total_questions', 'score', 'created_at']

class SessionStartSerializer(serializers.Serializer):
    session_type = serializers.ChoiceField(choices=Session.SESSION_TYPES)
    level_id = serializers.UUIDField(required=False)
    course_id = serializers.UUIDField(required=False)
    discipline_id = serializers.UUIDField(required=False)
    count = serializers.IntegerField(default=10, min_value=1, max_value=200)

class SessionDetailSerializer(serializers.ModelSerializer):
    answers = StudentAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Session
        fields = [
            'id', 'session_type', 'status', 'level', 'course', 
            'discipline', 'start_time', 'end_time', 'total_questions', 
            'score', 'answers', 'created_at'
        ]
