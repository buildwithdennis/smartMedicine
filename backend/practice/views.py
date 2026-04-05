from rest_framework import viewsets, status, decorators
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Q
from .models import Session, StudentAnswer
from .serializers import (
    SessionSerializer, 
    SessionStartSerializer, 
    SessionDetailSerializer,
    StudentAnswerSerializer
)
from questions.models import Question

class SessionViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @decorators.action(detail=False, methods=['post'])
    def start(self, request):
        serializer = SessionStartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Filter questions based on context
        questions_qs = Question.objects.filter(status='published')
        if data.get('level_id'):
            questions_qs = questions_qs.filter(level_id=data['level_id'])
        if data.get('course_id'):
            questions_qs = questions_qs.filter(course_id=data['course_id'])
        if data.get('discipline_id'):
            questions_qs = questions_qs.filter(discipline_id=data['discipline_id'])
            
        # Get random subset
        questions = list(questions_qs.order_by('?')[:data['count']])
        
        if not questions:
            return Response(
                {"error": "No questions found matching the selected tactical parameters."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create session
        session = Session.objects.create(
            user=request.user,
            session_type=data['session_type'],
            total_questions=len(questions),
            level_id=data.get('level_id'),
            course_id=data.get('course_id'),
            discipline_id=data.get('discipline_id')
        )
        
        # Return session and question IDs (frontend will fetch details or we can include them)
        # For performance, we'll embed the questions in the start response
        from questions.serializers import QuestionSerializer
        return Response({
            "session": SessionSerializer(session).data,
            "questions": QuestionSerializer(questions, many=True).data
        })

    @decorators.action(detail=True, methods=['post'])
    def answer(self, request, pk=None):
        session = self.get_object()
        if session.status != 'IN_PROGRESS':
            return Response({"error": "This mission is no longer active."}, status=status.HTTP_400_BAD_REQUEST)
            
        question_id = request.data.get('question_id')
        option_id = request.data.get('option_id')
        response_time_seconds = request.data.get('response_time', 0)
        
        import datetime
        answer, created = StudentAnswer.objects.update_or_create(
            session=session,
            question_id=question_id,
            defaults={
                'selected_option_id': option_id,
                'response_time': datetime.timedelta(seconds=response_time_seconds)
            }
        )
        
        return Response(StudentAnswerSerializer(answer).data)

    @decorators.action(detail=True, methods=['post'])
    def finish(self, request, pk=None):
        session = self.get_object()
        if session.status != 'IN_PROGRESS':
            return Response({"error": "Mission already finalized."}, status=status.HTTP_400_BAD_REQUEST)
            
        session.status = 'COMPLETED'
        session.end_time = timezone.now()
        
        # Calculate score
        correct_answers = session.answers.filter(is_correct=True).count()
        if session.total_questions > 0:
            session.score = (correct_answers / session.total_questions) * 100
            
        session.save()
        return Response(SessionDetailSerializer(session).data)

    @decorators.action(detail=False, methods=['get'])
    def analytics(self, request):
        # High-level performance overview
        user_sessions = self.get_queryset().filter(status='COMPLETED')
        total_answered = StudentAnswer.objects.filter(session__user=request.user).count()
        correct_answered = StudentAnswer.objects.filter(session__user=request.user, is_correct=True).count()
        
        accuracy = (correct_answered / total_answered * 100) if total_answered > 0 else 0
        
        # Performance by discipline
        discipline_stats = StudentAnswer.objects.filter(session__user=request.user).values(
            'question__discipline__name'
        ).annotate(
            total=Count('id'),
            correct=Count('id', filter=Q(is_correct=True))
        )

        return Response({
            "summary": {
                "total_missions": user_sessions.count(),
                "total_answered": total_answered,
                "overall_accuracy": round(accuracy, 2)
            },
            "disciplines": discipline_stats
        })

    @decorators.action(detail=False, methods=['get'])
    def mistakes(self, request):
        # Questions answered incorrectly at least once
        mistake_ids = StudentAnswer.objects.filter(
            session__user=request.user, 
            is_correct=False
        ).values_list('question_id', flat=True).distinct()
        
        questions = Question.objects.filter(id__in=mistake_ids)
        from questions.serializers import QuestionSerializer
        return Response(QuestionSerializer(questions, many=True).data)
