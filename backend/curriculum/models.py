import uuid
from django.db import models
from core.models import BaseModel

class Level(BaseModel):
    name = models.CharField(max_length=100, unique=True, help_text="e.g., Level 100")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name

class Course(BaseModel):
    level = models.ForeignKey(Level, on_delete=models.CASCADE, related_name='courses')
    name = models.CharField(max_length=200, help_text="e.g., Anatomy")
    code = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.level.name} - {self.name}"

class Discipline(BaseModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='disciplines')
    name = models.CharField(max_length=255, help_text="e.g., Upper Limb")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.course.name}: {self.name}"
