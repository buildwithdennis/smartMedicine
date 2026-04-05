from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Question
from .serializers import QuestionSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().prefetch_related('options')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['level', 'course', 'discipline', 'difficulty', 'question_type', 'status']
    search_fields = ['text', 'explanation']
    ordering_fields = ['created_at', 'difficulty']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Question.objects.all().prefetch_related('options')
        return Question.objects.filter(status='published').prefetch_related('options')
