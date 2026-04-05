import api from './axios';
import { type Question } from './questionService';

export interface StudentAnswer {
  id: string;
  question: string;
  selected_option: string;
  is_correct: boolean;
  response_time: string;
  created_at: string;
}

export interface Session {
  id: string;
  session_type: 'PRACTICE' | 'EXAM';
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  level: string | null;
  course: string | null;
  discipline: string | null;
  start_time: string;
  end_time: string | null;
  total_questions: number;
  score: string;
  answers?: StudentAnswer[];
  created_at: string;
}

export interface StartSessionParams {
  session_type: 'PRACTICE' | 'EXAM';
  level_id?: string;
  course_id?: string;
  discipline_id?: string;
  count?: number;
}

export const practiceService = {
  startSession: async (params: StartSessionParams) => {
    const response = await api.post<{ session: Session; questions: Question[] }>(
      '/practice/sessions/start/', 
      params
    );
    return response.data;
  },

  submitAnswer: async (sessionId: string, questionId: string, optionId: string, responseTime: number) => {
    const response = await api.post<StudentAnswer>(
      `/practice/sessions/${sessionId}/answer/`, 
      { question_id: questionId, option_id: optionId, response_time: responseTime }
    );
    return response.data;
  },

  finishSession: async (sessionId: string) => {
    const response = await api.post<Session>(`/practice/sessions/${sessionId}/finish/`);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/practice/sessions/analytics/');
    return response.data;
  },

  getSessionResults: async (sessionId: string) => {
    const response = await api.get<Session>(`/practice/sessions/${sessionId}/`);
    return response.data;
  },

  getMistakes: async () => {
    const response = await api.get<Question[]>('/practice/sessions/mistakes/');
    return response.data;
  }
};
