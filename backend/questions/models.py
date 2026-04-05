import uuid
from django.db import models
from django.core.exceptions import ValidationError
from core.models import BaseModel

class Question(BaseModel):
    TYPE_CHOICES = (
        ('SBA', 'Single Best Answer'),
        ('MCQ', 'Multiple Choice'),
    )
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    )
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    )

    level = models.ForeignKey('curriculum.Level', on_delete=models.CASCADE, related_name='questions')
    course = models.ForeignKey('curriculum.Course', on_delete=models.CASCADE, related_name='questions')
    discipline = models.ForeignKey('curriculum.Discipline', on_delete=models.CASCADE, related_name='questions')
    
    text = models.TextField()
    explanation = models.TextField(blank=True, help_text="Explanation shown after answering")
    question_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='SBA')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='draft')
    source_year = models.IntegerField(null=True, blank=True, help_text="Past question year if applicable")

    def clean(self):
        # Ensure hierarchy consistency
        if self.discipline.course != self.course:
            raise ValidationError("Discipline must belong to the selected Course.")
        if self.course.level != self.level:
            raise ValidationError("Course must belong to the selected Level.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Q: {self.text[:50]}..."

class QuestionOption(BaseModel):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.TextField()
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{'✓' if self.is_correct else '✗'} {self.text[:30]}"
