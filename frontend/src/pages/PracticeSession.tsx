import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { practiceService } from '../api/practiceService';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Flag, 
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PracticeSession: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activeSession, 
    questions, 
    currentQuestionIndex, 
    answers,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    selectOption,
    setSession,
  } = useSessionStore();

  const [searchParams] = useSearchParams();
  const initRef = React.useRef(false);

  // Auto-init session based on URL parameters
  React.useEffect(() => {
    const initSession = async () => {
      const courseId = searchParams.get('course');
      const disciplineId = searchParams.get('discipline');
      
      if (activeSession) return; 
      if (initRef.current) return;
      
      // If no valid academic parameter is passed, redirect out
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
        });
        setSession(response.session, response.questions);
      } catch (err) {
        console.error('Failed to initialize session:', err);
        navigate('/courses');
      }
    };
    initSession();
  }, [searchParams, activeSession, setSession, navigate]);

  const [isFinishing, setIsFinishing] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isSelected = (optionId: string) => answers[currentQuestion?.id] === optionId;

  // Timer logic for Exams
  React.useEffect(() => {
    if (activeSession?.session_type === 'EXAM') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? Math.max(prev - 1, 0) : 3600)); // Default 1hr
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeSession]);

  if (!activeSession || !currentQuestion) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto animate-[spin_3s_linear_infinite]">
            <Activity className="text-primary-600 animate-pulse" size={32} />
          </div>
          <p className="text-xl font-lexend font-bold text-slate-800 dark:text-slate-200">Generating Revision Mission...</p>
        </div>
      </div>
    );
  }

  const handleOptionSelect = async (optionId: string) => {
    selectOption(currentQuestion.id, optionId);
    
    // In background, sync to backend
    try {
      await practiceService.submitAnswer(
        activeSession.id, 
        currentQuestion.id, 
        optionId, 
        0 // TODO: Track response time properly
      );
    } catch (err) {
      console.error('Failed to sync response:', err);
    }
  };

  const handleFinish = async () => {
    if (!window.confirm('Finalize this mission? All responses will be locked.')) return;
    
    setIsFinishing(true);
    try {
      await practiceService.finishSession(activeSession.id);
      const resultsId = activeSession.id;
      // We don't clear session yet, we'll let results page see it
      navigate(`/results/${resultsId}`);
    } catch (err) {
      console.error('Failed to finalize mission:', err);
      setIsFinishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-inter">
      {/* Simulation Header */}
      <header className="h-20 glass flex items-center justify-between px-10 z-30 sticky top-0 border-b border-gray-100 dark:border-slate-800/50">
        <div className="flex items-center gap-6">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-sm ${
            activeSession.session_type === 'EXAM' ? 'bg-rose-600 text-white' : 'bg-primary-600 text-white'
          }`}>
            {activeSession.session_type} Mode Active
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <span className="text-slate-900 dark:text-white font-lexend">Mission: </span>
            {activeSession.discipline || activeSession.course || 'General Practice'}
          </div>
        </div>

        <div className="flex items-center gap-8">
          {activeSession.session_type === 'EXAM' && (
            <div className="flex items-center gap-3 px-6 py-2 bg-slate-900 border-2 border-rose-500/20 rounded-2xl text-white">
              <Clock className="text-rose-500 animate-pulse" size={18} />
              <span className="font-mono font-bold text-lg tracking-tighter">
                {Math.floor((timeLeft || 0) / 60)}:{((timeLeft || 0) % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
          <button 
            onClick={handleFinish}
            disabled={isFinishing}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-primary-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary-600/20 disabled:opacity-50"
          >
            Finalize {isFinishing ? '...' : <Flag size={14} />}
          </button>
        </div>
      </header>

      {/* Simulation Core */}
      <main className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar (Question Grid) */}
        <aside className="w-80 glass border-r border-gray-100 dark:border-slate-900 p-8 hidden lg:flex flex-col gap-6 overflow-y-auto">
          <h4 className="font-lexend font-bold text-sm uppercase tracking-widest text-slate-400">Navigation Matrix</h4>
          <div className="grid grid-cols-5 gap-3">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => goToQuestion(i)}
                className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                  currentQuestionIndex === i 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-110' 
                    : answers[questions[i].id] 
                      ? 'bg-emerald-500/20 text-emerald-600 border-2 border-emerald-500/30' 
                      : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          
          <div className="mt-auto p-6 bg-primary-600/5 rounded-[2rem] border border-primary-600/10">
            <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mb-2">Tactical Summary</p>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-medium text-slate-500">Addressed</span>
                <span className="font-lexend font-bold">{Object.keys(answers).length}/{questions.length}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 transition-all duration-500" 
                  style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className="flex-1 p-10 overflow-y-auto relative bg-white dark:bg-slate-950/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto space-y-12 pb-24"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold font-lexend">{currentQuestionIndex + 1}</span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{currentQuestion.difficulty} Tier</span>
                </div>
                
                <h1 className="text-2xl lg:text-3xl font-medium text-slate-900 dark:text-white leading-relaxed">
                  {currentQuestion.text}
                </h1>
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full p-6 text-left rounded-[2rem] border-2 transition-all group flex items-center gap-6 ${
                      isSelected(option.id)
                        ? 'bg-primary-600/5 border-primary-600 shadow-xl'
                        : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-primary-500/30'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isSelected(option.id)
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 group-hover:border-primary-500'
                    }`}>
                      {isSelected(option.id) ? <Check size={16} /> : <span className="text-xs font-bold font-lexend uppercase tracking-tighter">{String.fromCharCode(65 + currentQuestion.options.indexOf(option))}</span>}
                    </div>
                    <span className={`flex-1 font-medium text-lg leading-tight ${isSelected(option.id) ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls Footer */}
          <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between pointer-events-none">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="w-14 h-14 glass rounded-3xl flex items-center justify-center text-slate-500 hover:text-primary-600 transition-all pointer-events-auto disabled:opacity-20 translate-y-0 hover:-translate-y-1 active:scale-95"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="w-14 h-14 glass rounded-3xl flex items-center justify-center text-slate-500 hover:text-primary-600 transition-all pointer-events-auto disabled:opacity-20 translate-y-0 hover:-translate-y-1 active:scale-95"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

// Activity import fix
import { Activity } from 'lucide-react';

export default PracticeSession;
