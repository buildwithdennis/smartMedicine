import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Session } from '../api/practiceService';
import { type Question } from '../api/questionService';

interface ExamState {
  activeExam: Session | null;
  questions: Question[];
  answers: Record<string, string>; // questionId -> optionId
  flags: Record<string, boolean>; // questionId -> isFlagged
  currentPage: number;
  timeRemaining: number; // in seconds
  isExamActive: boolean;

  // Actions
  startExam: (session: Session, questions: Question[]) => void;
  submitAnswer: (questionId: string, optionId: string) => void;
  toggleFlag: (questionId: string) => void;
  setPage: (page: number) => void;
  updateTimer: () => void;
  finishExam: () => void;
  clearExam: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      activeExam: null,
      questions: [],
      answers: {},
      flags: {},
      currentPage: 0,
      timeRemaining: 3 * 60 * 60, // Default 3 hours (180 mins)
      isExamActive: false,

      startExam: (session, questions) => set({
        activeExam: session,
        questions,
        answers: {},
        flags: {},
        currentPage: 0,
        timeRemaining: 3 * 60 * 60,
        isExamActive: true,
      }),

      submitAnswer: (questionId, optionId) => {
        set((state) => ({
          answers: { ...state.answers, [questionId]: optionId }
        }));
      },

      toggleFlag: (questionId) => {
        set((state) => ({
          flags: { ...state.flags, [questionId]: !state.flags[questionId] }
        }));
      },

      setPage: (page) => set({ currentPage: page }),

      updateTimer: () => {
        const { timeRemaining, isExamActive } = get();
        if (!isExamActive) return;
        if (timeRemaining <= 0) {
          set({ isExamActive: false, timeRemaining: 0 });
          return;
        }
        set({ timeRemaining: timeRemaining - 1 });
      },

      finishExam: () => set({ isExamActive: false }),

      clearExam: () => set({
        activeExam: null,
        questions: [],
        answers: {},
        flags: {},
        currentPage: 0,
        timeRemaining: 3 * 60 * 60,
        isExamActive: false,
      }),
    }),
    {
      name: 'smartmed-exam-storage',
    }
  )
);
