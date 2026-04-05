from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models import BaseModel

class User(AbstractUser, BaseModel):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('admin', 'Admin'),
    )
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    registration_id = models.CharField(max_length=50, unique=True, null=True, blank=True)

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username

class StudentProfile(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    # Level will be a FK to curriculum.Level, but we define it as a string for now or 
    # use a lazy reference if curriculum is not yet fully migrated.
    level = models.ForeignKey('curriculum.Level', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
