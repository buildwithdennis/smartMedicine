from django.contrib import admin
from .models import Level, Course, Discipline

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'is_active')
    list_editable = ('order', 'is_active')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'code', 'is_active')
    list_filter = ('level', 'is_active')
    search_fields = ('name', 'code')

@admin.register(Discipline)
class DisciplineAdmin(admin.ModelAdmin):
    list_display = ('name', 'course', 'is_active')
    list_filter = ('course__level', 'course', 'is_active')
    search_fields = ('name',)
