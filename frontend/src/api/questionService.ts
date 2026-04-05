import api from './axios';

export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
  order: number;
}

export interface Question {
  id: string;
  level: string;
  course: string;
  discipline: string;
  text: string;
  explanation: string;
  question_type: 'SBA' | 'MCQ';
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published' | 'archived';
  source_year?: number;
  options: QuestionOption[];
}

export const questionService = {
  getQuestions: async (filters: { 
    level?: string; 
    course?: string; 
    discipline?: string; 
    difficulty?: string;
    question_type?: string;
    search?: string;
  }) => {
    const response = await api.get<Question[]>('/questions/', { params: filters });
    return response.data;
  },
  getQuestionDetail: async (id: string) => {
    const response = await api.get<Question>(`/questions/${id}/`);
    return response.data;
  },
};
