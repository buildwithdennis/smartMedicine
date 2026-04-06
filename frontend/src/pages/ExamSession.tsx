import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExamStore } from '../store/examStore';
import ExamHeader from '../components/exam/ExamHeader';
import ExamQuestionBlock from '../components/exam/ExamQuestionBlock';
import ExamNavigator from '../components/exam/ExamNavigator';
import { practiceService } from '../api/practiceService';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExamSession: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activeExam, 
    questions, 
    answers, 
    flags, 
    currentPage, 
    setPage, 
    submitAnswer, 
    toggleFlag,
    finishExam
  } = useExamStore();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activeExam || questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-amber-500" />
          <h2 className="text-2xl font-bold">No Active Exam Session</h2>
          <button 
            onClick={() => navigate('/exams')}
            className="px-6 py-2 bg-primary-600 rounded-xl font-bold"
          >
            Go to Exam Setup
          </button>
        </div>
      </div>
    );
  }

  const QUESTIONS_PER_PAGE = 5;
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  const handleAnswerSelect = async (questionId: string, optionId: string) => {
    submitAnswer(questionId, optionId);
    // Autosave to backend
    try {
      await practiceService.submitAnswer(activeExam.id, questionId, optionId, 0);
    } catch (err) {
      console.error('Autosave failed:', err);
    }
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    try {
      await practiceService.finishSession(activeExam.id);
      finishExam();
      navigate(`/exam-results/${activeExam.id}`);
    } catch (err) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
    }
  };

  const unansweredCount = questions.length - Object.keys(answers).length;
  const flaggedCount = Object.keys(flags).filter(id => !!flags[id]).length;

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-inter overflow-hidden">
      <ExamHeader onSubmit={() => setIsSubmitModalOpen(true)} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-10 lg:px-10 custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
          <div className="max-w-4xl mx-auto space-y-8 pb-24">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPage}
                initial={{ opacity: 0, scale: 0.99, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {currentQuestions.map((q, idx) => (
                  <ExamQuestionBlock
                    key={q.id}
                    question={q}
                    index={startIndex + idx + 1}
                    selectedOptionId={answers[q.id]}
                    isFlagged={!!flags[q.id]}
                    onSelect={(optId) => handleAnswerSelect(q.id, optId)}
                    onToggleFlag={() => toggleFlag(q.id)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-10 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:shadow-md transition-all active:scale-95"
              >
                <ChevronLeft size={20} /> Previous Page
              </button>

              <div className="text-sm font-bold text-slate-400">
                Page {currentPage + 1} of {totalPages}
              </div>

              {currentPage < totalPages - 1 ? (
                <button
                  onClick={() => setPage(currentPage + 1)}
                  className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-500 shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                >
                  Next Page <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:opacity-90 shadow-lg transition-all active:scale-95"
                >
                  Final Review <CheckCircle2 size={20} />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar Navigator - Desktop Only */}
        <div className="hidden lg:block h-full">
          <ExamNavigator />
        </div>
      </div>

      {/* Submission Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsSubmitModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-primary-50 dark:bg-primary-500/10 rounded-3xl flex items-center justify-center mx-auto text-primary-600">
                  <CheckCircle2 size={40} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to submit?</h3>
                  <p className="text-slate-500 dark:text-slate-400">Review your progress summary before finalizing your exam attempt.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className={`text-2xl font-bold ${unansweredCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>{unansweredCount}</span>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Unanswered</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-2xl font-bold text-primary-600">{flaggedCount}</span>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Flagged</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSubmitExam}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-600/20"
                  >
                    {isSubmitting ? 'Finalizing Submission...' : 'Yes, Submit My Exam'}
                  </button>
                  <button
                    onClick={() => setIsSubmitModalOpen(false)}
                    disabled={isSubmitting}
                    className="w-full py-4 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-800 dark:hover:text-white transition-all"
                  >
                    Return to Exam
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamSession;
