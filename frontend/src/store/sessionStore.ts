import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Session } from '../api/practiceService';
import { type Question } from '../api/questionService';

interface SessionState {
  activeSession: Session | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>; // questionId -> optionId
  startTime: number | null;
  
  // Actions
  setSession: (session: Session, questions: Question[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  selectOption: (questionId: string, optionId: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      activeSession: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      startTime: null,

      setSession: (session, questions) => set({ 
        activeSession: session, 
        questions, 
        currentQuestionIndex: 0,
        answers: {},
        startTime: Date.now()
      }),

      nextQuestion: () => set((state) => ({ 
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1) 
      })),

      prevQuestion: () => set((state) => ({ 
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0) 
      })),

      goToQuestion: (index) => set({ currentQuestionIndex: index }),

      selectOption: (questionId, optionId) => set((state) => ({
        answers: { ...state.answers, [questionId]: optionId }
      })),

      clearSession: () => set({ 
        activeSession: null, 
        questions: [], 
        currentQuestionIndex: 0, 
        answers: {},
        startTime: null
      }),
    }),
    {
      name: 'smartmed-session-storage',
    }
  )
);
