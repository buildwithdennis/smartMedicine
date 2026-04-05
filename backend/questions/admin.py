from django.contrib import admin
from .models import Question, QuestionOption

class QuestionOptionInline(admin.TabularInline):
    model = QuestionOption
    extra = 4

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text_snippet', 'level', 'course', 'discipline', 'difficulty', 'status')
    list_filter = ('level', 'course', 'status', 'difficulty')
    search_fields = ('text', 'explanation')
    inlines = [QuestionOptionInline]

    def text_snippet(self, obj):
        return obj.text[:50] + "..." if len(obj.text) > 50 else obj.text
    text_snippet.short_description = 'Question Text'
