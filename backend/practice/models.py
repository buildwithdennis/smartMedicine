from django.db import models
from django.conf import settings
from core.models import BaseModel
from curriculum.models import Level, Course, Discipline
from questions.models import Question, QuestionOption

class Session(BaseModel):
    SESSION_TYPES = [
        ('PRACTICE', 'Practice Mode'),
        ('EXAM', 'Exam Simulation'),
    ]
    STATUS_CHOICES = [
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('ABANDONED', 'Abandoned'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sessions'
    )
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES, default='PRACTICE')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='IN_PROGRESS')
    
    # Context (Optional filtering)
    level = models.ForeignKey(Level, on_delete=models.SET_NULL, null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)
    discipline = models.ForeignKey(Discipline, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Metrics
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    total_questions = models.PositiveIntegerField(default=0)
    score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # Accuracy %

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.session_type} ({self.status})"

class StudentAnswer(BaseModel):
    session = models.ForeignKey(
        Session,
        on_delete=models.CASCADE,
        related_name='answers'
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(QuestionOption, on_delete=models.CASCADE)
    
    # Denormalized for performance/analytics
    is_correct = models.BooleanField(default=False)
    response_time = models.DurationField(null=True, blank=True) # Seconds taken

    class Meta:
        unique_together = ['session', 'question']

    def save(self, *args, **kwargs):
        # Automatically determine correctness on save
        self.is_correct = self.selected_option.is_correct
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.session.id} - Q: {self.question.id} (Correct: {self.is_correct})"
