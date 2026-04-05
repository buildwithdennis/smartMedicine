import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { practiceService } from '../api/practiceService';
import { type QuestionOption } from '../api/questionService';
import { 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  BookOpen,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PracticeSession: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initRef = React.useRef(false);

  const { 
    activeSession, 
    questions, 
    currentQuestionIndex, 
    answers,
    nextQuestion,
    selectOption,
    setSession,
  } = useSessionStore();

  const [isFinishing, setIsFinishing] = React.useState(false);

  // Auto-init session based on URL parameters
  React.useEffect(() => {
    const initSession = async () => {
      const courseId = searchParams.get('course');
      const disciplineId = searchParams.get('discipline');
      const countStr = searchParams.get('count');
      
      if (activeSession) return; 
      if (initRef.current) return;
      
      if (!courseId && !disciplineId) {
        navigate('/courses');
        return;
      }

      initRef.current = true;
      try {
        const response = await practiceService.startSession({
          session_type: 'PRACTICE',
          course_id: courseId || undefined,
          discipline_id: disciplineId || undefined,
          count: countStr ? parseInt(countStr) : 20
        });
        setSession(response.session, response.questions);
      } catch (err) {
        console.error('Failed to initialize session:', err);
        navigate('/courses');
      }
    };
    initSession();
  }, [searchParams, activeSession, setSession, navigate]);

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = currentQuestion && !!answers[currentQuestion.id];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : null;

  if (!activeSession || !currentQuestion) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto animate-[spin_3s_linear_infinite]">
            <Activity className="text-primary-600 animate-pulse" size={32} />
          </div>
          <p className="text-xl font-lexend font-bold text-slate-800 dark:text-slate-200">Generating Revision Sequence...</p>
        </div>
      </div>
    );
  }

  const handleOptionSelect = async (optionId: string) => {
    if (isAnswered) return; // Prevent changing answer!
    
    selectOption(currentQuestion.id, optionId);
    
    // In background, sync to backend
    try {
      await practiceService.submitAnswer(
        activeSession.id, 
        currentQuestion.id, 
        optionId, 
        10 // hardcode response time temporarily
      );
    } catch (err) {
      console.error('Failed to sync response:', err);
    }
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      await practiceService.finishSession(activeSession.id);
      navigate(`/results/${activeSession.id}`);
    } catch (err) {
      console.error('Failed to finalize session:', err);
      setIsFinishing(false);
    }
  };

  const getSelectedOptionObj = () => {
    return currentQuestion.options.find(o => o.id === selectedOptionId);
  };
  const selectedOptionIsCorrect = getSelectedOptionObj()?.is_correct;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-inter">
      {/* 1. ELEGANT HEADER */}
      <header className="h-20 bg-white dark:bg-slate-950 flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0 border-b border-gray-100 dark:border-slate-800/50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <div className="px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-slate-400 hidden sm:block border border-gray-200 dark:border-slate-800">
            Practice Mode
          </div>
          <div className="font-lexend font-bold text-sm sm:text-base text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-md">
            {activeSession.discipline || activeSession.course || 'General Revision'}
          </div>
        </div>

        <div className="flex items-center gap-4">
           <span className="font-bold text-sm text-slate-500 dark:text-slate-400">
             Question <span className="text-slate-800 dark:text-white">{currentQuestionIndex + 1}</span> of {questions.length}
           </span>
           <button 
             onClick={() => {
               if(window.confirm('Are you sure you want to exit early? Your progress will be saved.')) {
                 handleFinish();
               }
             }}
             className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-colors"
           >
             Exit
           </button>
        </div>
      </header>

      {/* 2. MAIN EDUCATIONAL CORE */}
      <main className="flex-1 overflow-y-auto px-4 py-10 sm:p-10 relative">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto space-y-8 pb-16"
          >
            {/* Question Text */}
            <h1 className="text-xl sm:text-2xl font-medium text-slate-800 dark:text-white leading-relaxed">
              {currentQuestion.text}
            </h1>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option: QuestionOption, index: number) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrect = option.is_correct;
                
                let cardClass = 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-400 shadow-sm transition-all cursor-pointer group';
                let iconClass = 'bg-gray-100 dark:bg-slate-800 text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600';
                
                if (isAnswered) {
                  // Lock states
                  if (isCorrect) {
                     cardClass = 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-md ring-1 ring-emerald-500/50 cursor-default';
                     iconClass = 'bg-emerald-500 text-white';
                  } else if (isSelected) {
                     cardClass = 'bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-100 cursor-default';
                     iconClass = 'bg-rose-500 text-white';
                  } else {
                     cardClass = 'bg-white/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800 text-gray-400 dark:text-slate-600 opacity-60 cursor-default';
                     iconClass = 'bg-gray-50 dark:bg-slate-800 text-gray-400';
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={isAnswered}
                    className={`w-full p-5 sm:p-6 text-left rounded-3xl border-2 flex items-center gap-5 ${cardClass}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${iconClass}`}>
                      {isAnswered && isCorrect ? <CheckCircle2 size={18} /> : 
                       isAnswered && isSelected && !isCorrect ? <XCircle size={18} /> :
                       String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1 font-medium text-base leading-tight">
                      {option.text}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* 3. IMMEDIATE FEEDBACK & EXPLANATION */}
            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-6 space-y-6"
              >
                {/* Status Bar */}
                <div className={`p-5 sm:p-6 rounded-2xl flex items-center gap-4 shadow-sm border ${
                  selectedOptionIsCorrect 
                   ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                   : 'bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                }`}>
                  {selectedOptionIsCorrect ? (
                    <><CheckCircle2 size={24} className="shrink-0" /> <span className="font-bold text-lg sm:text-xl">Correct Answer ✅</span></>
                  ) : (
                    <><AlertTriangle size={24} className="shrink-0" /> <span className="font-bold text-lg sm:text-xl">Incorrect — review the answer below</span></>
                  )}
                </div>

                {/* Explanation Content */}
                {currentQuestion.explanation && (
                  <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-primary-600 mb-4 flex items-center gap-2">
                      <BookOpen size={16} /> Explanation
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-base">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
            
          </motion.div>
        </AnimatePresence>

            {/* 4. POST-ANSWER NAVIGATION - MOVED INLINE */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-start"
                >
                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={nextQuestion}
                      className="btn-primary py-3.5 px-8 rounded-xl flex items-center justify-center gap-3 font-bold text-base shadow-lg shadow-primary-600/20 active:scale-95 transition-transform"
                    >
                      Next Question <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinish}
                      disabled={isFinishing}
                      className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 px-8 rounded-xl flex items-center justify-center gap-3 font-bold text-base border border-transparent shadow-lg active:scale-95 transition-transform disabled:opacity-50"
                    >
                      {isFinishing ? 'Saving...' : 'Complete Session 🎉'}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

      </main>
    </div>
  );
};

export default PracticeSession;
