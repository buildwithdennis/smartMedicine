import React from 'react';
import { useExamStore } from '../../store/examStore';
import { Clock, CheckSquare } from 'lucide-react';

const ExamHeader: React.FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const { 
    activeExam, 
    currentPage, 
    questions, 
    timeRemaining, 
    updateTimer 
  } = useExamStore();

  React.useEffect(() => {
    const timer = setInterval(() => {
      updateTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [updateTimer]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalPages = Math.ceil(questions.length / 5);
  const startRange = currentPage * 5 + 1;
  const endRange = Math.min((currentPage + 1) * 5, questions.length);

  return (
    <header className="h-20 bg-slate-900 text-white flex items-center justify-between px-6 lg:px-10 z-50 sticky top-0 border-b border-white/10 shadow-2xl backdrop-blur-xl bg-slate-900/90">
      <div className="flex flex-col">
        <h2 className="font-lexend font-bold text-lg text-primary-400 truncate max-w-[200px] sm:max-w-md">
          {activeExam?.course || 'Medical Mock Exam'}
        </h2>
        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <span>Exam Mode</span>
          <span className="w-1 h-1 bg-slate-600 rounded-full" />
          <span>Page {currentPage + 1} of {totalPages}</span>
          <span className="w-1 h-1 bg-slate-600 rounded-full" />
          <span>Questions {startRange}-{endRange} of {questions.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-colors ${timeRemaining < 300 ? 'bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse' : 'bg-white/5 border-white/10 text-white'}`}>
          <Clock size={18} />
          <span className="font-mono font-bold text-lg tabular-nums">
            {formatTime(timeRemaining)}
          </span>
        </div>

        <button 
          onClick={onSubmit}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20 flex items-center gap-2 active:scale-95"
        >
          <CheckSquare size={18} />
          <span>Submit Exam</span>
        </button>
      </div>
    </header>
  );
};

export default ExamHeader;
