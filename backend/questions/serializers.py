from rest_framework import serializers
from .models import Question, QuestionOption

class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ('id', 'text', 'is_correct', 'order')

class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True)
    course_name = serializers.ReadOnlyField(source='course.name')
    discipline_name = serializers.ReadOnlyField(source='discipline.name')

    class Meta:
        model = Question
        fields = (
            'id', 'level', 'course', 'course_name', 'discipline', 'discipline_name',
            'text', 'explanation', 'question_type', 
            'difficulty', 'status', 'source_year', 'options'
        )

    def create(self, validated_data):
        options_data = validated_data.pop('options')
        question = Question.objects.create(**validated_data)
        for option_data in options_data:
            QuestionOption.objects.create(question=question, **option_data)
        return question

    def update(self, instance, validated_data):
        options_data = validated_data.pop('options', None)
        
        # Update question fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update options if provided
        if options_data is not None:
            instance.options.all().delete()
            for option_data in options_data:
                QuestionOption.objects.create(question=instance, **option_data)
        
        return instance

    def validate(self, data):
        # Additional validation can go here if needed 
        # (Model.clean already handles basic hierarchy consistency)
        return data
