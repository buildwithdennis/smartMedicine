import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSessionStore } from '../store/sessionStore';
import { practiceService } from '../api/practiceService';
import { curriculumService } from '../api/curriculumService';
import { type QuestionOption } from '../api/questionService';
import { 
  ChevronRight, 
  CheckCircle2, 
  XCircle,
  BookOpen,
  Activity,
  AlertTriangle,
  ChevronLeft,
  LayoutGrid,
  Columns
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
    prevQuestion,
    goToQuestion,
    selectOption,
    setSession,
  } = useSessionStore();

  const [isFinishing, setIsFinishing] = React.useState(false);
  const [showSidebar, setShowSidebar] = React.useState(true);

  // Auto-init session based on URL parameters
  React.useEffect(() => {
    const initSession = async () => {
      const courseId = searchParams.get('course');
      const disciplineId = searchParams.get('discipline');
      const countStr = searchParams.get('count');
      
      // If we have an active session that matches the current parameters, don't re-init
      if (activeSession && 
          activeSession.course === courseId && 
          activeSession.discipline === (disciplineId || null)) {
        return; 
      }

      if (initRef.current) return;
      initRef.current = true;
      
      if (!courseId && !disciplineId) {
        navigate('/courses');
        return;
      }

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
  }, [searchParams, activeSession?.id, setSession, navigate]);

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = currentQuestion && !!answers[currentQuestion.id];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : null;

  // Resolve Course logic mapping
  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => curriculumService.getCourses(),
  });

  const { data: disciplines } = useQuery({
    queryKey: ['disciplines', activeSession?.course],
    queryFn: () => curriculumService.getDisciplines(activeSession?.course || undefined),
    enabled: !!activeSession?.course,
  });

  const courseObj = courses?.find(c => c.id === activeSession?.course);
  const disciplineObj = disciplines?.find(d => d.id === activeSession?.discipline);
  
  const headerContextTarget = disciplineObj?.name 
    ? `${courseObj?.code ? `[${courseObj.code}] ` : ''}${courseObj?.name || 'Course'} • ${disciplineObj.name}` 
    : (courseObj ? `${courseObj.code ? `[${courseObj.code}] ` : ''}${courseObj.name}` : 'General Revision');

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
    <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-inter overflow-hidden">
      {/* 1. ELEGANT HEADER */}
      <header className="h-16 bg-white dark:bg-slate-950 flex items-center justify-between px-6 lg:px-10 z-30 shrink-0 border-b border-gray-100 dark:border-slate-800/50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
          <div className="px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-slate-400 hidden sm:block border border-gray-200 dark:border-slate-800">
            Practice Mode
          </div>
          <div className="font-lexend font-bold text-sm sm:text-base text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-md">
            {headerContextTarget}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
           <button 
             onClick={() => setShowSidebar(!showSidebar)}
             className={`p-2.5 rounded-xl border transition-all active:scale-95 flex items-center gap-2 ${
               showSidebar 
                 ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-500/10 dark:border-primary-500/30' 
                 : 'bg-white border-gray-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
             }`}
             title={showSidebar ? "Hide Navigator" : "Show Navigator"}
           >
             {showSidebar ? <Columns size={20} /> : <LayoutGrid size={20} />}
             <span className="hidden md:inline font-bold text-xs uppercase tracking-wider">Navigator</span>
           </button>

           <div className="h-8 w-[1px] bg-gray-200 dark:bg-slate-800 mx-1 hidden sm:block" />
           
           <span className="font-bold text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">
             Question <span className="text-slate-800 dark:text-white">{currentQuestionIndex + 1}</span> of {questions.length}
           </span>
           <button 
             onClick={() => {
               if(window.confirm('Are you sure you want to end practice early? You will be returned to the course library.')) {
                 navigate('/courses');
               }
             }}
             className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-500/20 active:scale-95"
           >
             Exit
           </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 2. MAIN EDUCATIONAL CORE */}
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:py-10 relative bg-slate-50 dark:bg-slate-950 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto space-y-6 pb-20"
            >
              {/* Question Text */}
              <h1 className="text-lg sm:text-xl font-medium text-slate-800 dark:text-white leading-relaxed">
                {currentQuestion.text}
              </h1>

              {/* Answer Options */}
              <div className="space-y-3">
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
                      className={`w-full p-4 text-left rounded-[1.5rem] border-2 flex items-center gap-4 ${cardClass}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${iconClass}`}>
                        {isAnswered && isCorrect ? <CheckCircle2 size={16} /> : 
                         isAnswered && isSelected && !isCorrect ? <XCircle size={16} /> :
                         String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1 font-medium text-sm sm:text-base leading-tight">
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

                  {currentQuestion.explanation && (
                    <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500" />
                      <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-primary-600 mb-2 sm:mb-3 flex items-center gap-2">
                        <BookOpen size={14} /> Explanation
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-sm sm:text-base">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 4. POST-ANSWER NAVIGATION */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto flex justify-between items-center pb-20"
              >
                <button
                   onClick={prevQuestion}
                   disabled={currentQuestionIndex === 0}
                   className="glass py-3.5 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors disabled:opacity-30"
                >
                   <ChevronLeft size={18} /> <span className="hidden sm:inline">Previous</span>
                </button>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={nextQuestion}
                    className="btn-primary py-3.5 px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2 sm:gap-3 font-bold text-sm sm:text-base shadow-lg shadow-primary-600/20 active:scale-95 transition-transform"
                  >
                    Next Question <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    disabled={isFinishing}
                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3.5 px-6 sm:px-8 rounded-xl flex items-center justify-center gap-2 sm:gap-3 font-bold text-sm sm:text-base border border-transparent shadow-lg active:scale-95 transition-transform disabled:opacity-50"
                  >
                    {isFinishing ? 'Saving...' : 'Complete Session 🎉'}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* 5. SIDEBAR NAVIGATION GRID */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside 
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full lg:w-80 bg-white dark:bg-slate-950 border-l border-gray-100 dark:border-slate-800/50 p-6 flex flex-col gap-6 overflow-y-auto shrink-0 z-20 h-auto lg:h-fit lg:max-h-[calc(100vh-100px)] lg:m-4 lg:rounded-3xl lg:border lg:shadow-xl lg:shadow-slate-200/50 dark:lg:shadow-slate-900/50"
            >
               <div className="space-y-1">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Question Navigator</h3>
                 <div className="flex items-center justify-between">
                    <span className="text-xl font-lexend font-bold text-slate-800 dark:text-white">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-primary-500">
                      {questions.filter(q => !!answers[q.id]).length} / {questions.length}
                    </span>
                 </div>
                 {/* Progress Bar */}
                 <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mt-4">
                   <div 
                     className="h-full bg-primary-500 transition-all duration-500" 
                     style={{ width: `${(questions.filter(q => !!answers[q.id]).length / questions.length) * 100}%` }} 
                   />
                 </div>
               </div>

               <div className="grid grid-cols-5 gap-3">
                 {questions.map((q, i) => {
                    const isAnsweredNode = !!answers[q.id];
                    const isCorrectNode = isAnsweredNode && q.options.find(o => o.id === answers[q.id])?.is_correct;
                    
                    let bubbleClass = "border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-500 hover:border-primary-500";
                    if (currentQuestionIndex === i) {
                        bubbleClass = "border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-600 ring-2 ring-primary-500/20";
                    } else if (isAnsweredNode) {
                        bubbleClass = isCorrectNode 
                           ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" 
                           : "border-rose-500 bg-rose-50 dark:bg-rose-500/10 text-rose-600";
                    }
                    
                    return (
                      <button 
                        key={q.id}
                        onClick={() => goToQuestion(i)}
                        className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm transition-all active:scale-90 ${bubbleClass}`}
                      >
                        {i + 1}
                      </button>
                    )
                 })}
               </div>

               <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-800">
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <Activity size={18} />
                    <span className="text-xs font-medium">Auto-saving responses...</span>
                  </div>
               </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PracticeSession;
