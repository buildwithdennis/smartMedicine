import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { practiceService } from '../api/practiceService';
import { 
  Trophy, 
  Target, 
  Clock, 
  ChevronRight, 
  Home, 
  BookOpen,
  PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';

const ExamResults: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => practiceService.getSessionResults(sessionId!),
    enabled: !!sessionId,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-bold">Calculating Results...</p>
        </div>
      </div>
    );
  }

  if (!session) return <div>Session not found</div>;

  const score = parseFloat(session.score);
  const percentage = (score / session.total_questions) * 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 lg:p-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200 dark:shadow-slate-950/50 overflow-hidden border border-gray-100 dark:border-slate-800"
      >
        <div className="grid lg:grid-cols-2">
          {/* Left Side: Score Summary */}
          <div className="p-10 lg:p-16 bg-slate-900 text-white flex flex-col justify-center items-center text-center space-y-8">
            <div className="space-y-2">
              <span className="text-primary-400 font-bold uppercase tracking-[0.2em] text-xs">Exam Complete</span>
              <h1 className="text-4xl font-lexend font-bold">Great Effort!</h1>
            </div>

            <div className="relative w-48 h-48 flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                 <circle
                   cx="96" cy="96" r="88"
                   className="stroke-white/10 fill-none"
                   strokeWidth="12"
                 />
                 <circle
                   cx="96" cy="96" r="88"
                   className="stroke-primary-500 fill-none transition-all duration-1000"
                   strokeWidth="12"
                   strokeDasharray={2 * Math.PI * 88}
                   strokeDashoffset={2 * Math.PI * 88 * (1 - percentage / 100)}
                   strokeLinecap="round"
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-5xl font-lexend font-bold">{Math.round(percentage)}%</span>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Final Score</span>
               </div>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed max-w-xs">
              You answered {session.answers?.length} out of {session.total_questions} questions correctly.
            </p>
          </div>

          {/* Right Side: Details & Actions */}
          <div className="p-10 lg:p-16 flex flex-col justify-center space-y-10">
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                 <div className="flex items-center gap-2 text-slate-400">
                   <Target size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Points</span>
                 </div>
                 <p className="text-2xl font-bold text-slate-800 dark:text-white">{score} / {session.total_questions}</p>
               </div>
               <div className="space-y-1">
                 <div className="flex items-center gap-2 text-slate-400">
                   <Clock size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Time Used</span>
                 </div>
                 <p className="text-2xl font-bold text-slate-800 dark:text-white">1:42:05</p>
               </div>
               <div className="space-y-1">
                 <div className="flex items-center gap-2 text-slate-400">
                   <PieChart size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Accuracy</span>
                 </div>
                 <p className="text-2xl font-bold text-emerald-500">{Math.round(percentage)}%</p>
               </div>
               <div className="space-y-1">
                 <div className="flex items-center gap-2 text-slate-400">
                   <BookOpen size={14} /> <span className="text-[10px] font-bold uppercase tracking-widest">Status</span>
                 </div>
                 <p className="text-2xl font-bold text-primary-500 uppercase tracking-tighter">PASSED</p>
               </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate(`/exam-review/${sessionId}`)}
                className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-lg shadow-primary-600/20"
              >
                Review Answers <ChevronRight size={20} />
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  <Home size={18} /> Dashboard
                </button>
                <button
                  onClick={() => navigate('/exams')}
                  className="py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  <Trophy size={18} /> New Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExamResults;
