import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { practiceService } from '../api/practiceService';
import { 
  Trophy, 
  RotateCcw, 
  Target,
  Clock,
  BookOpen,
  ArrowRight,
  ListChecks,
  Activity,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';

const SessionResults: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading } = useQuery({
    queryKey: ['session-results', sessionId],
    queryFn: () => practiceService.getSessionResults(sessionId!),
    enabled: !!sessionId,
  });

  if (isLoading || !session) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto animate-[spin_3s_linear_infinite]">
            <Activity className="text-primary-600 animate-pulse" size={32} />
          </div>
          <p className="text-xl font-lexend font-bold text-slate-800 dark:text-slate-200">Analyzing Performance...</p>
        </div>
      </div>
    );
  }

  const scoreNum = parseFloat(session.score);
  const correctAnswers = Math.round((scoreNum * session.total_questions) / 100);

  // Generate dynamic academic insight
  const getPerformanceInsight = (score: number) => {
    if (score >= 80) return "Excellent work — you demonstrated strong mastery in this session.";
    if (score >= 60) return "Good attempt. Review missed explanations to strengthen retention.";
    return "Keep going. Consider reviewing the course material before your next practice.";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-inter pb-20 py-10">
      <div className="max-w-4xl mx-auto px-6 space-y-10 animate-fade-in">
        
        {/* 1. COMPLETION HEADER */}
        <div className="text-center space-y-4 pt-10">
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 mb-6 relative">
             <div className="absolute inset-0 bg-white/20 blur-xl rounded-[2rem] animate-pulse" />
             <CheckCircle2 size={40} className="relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-lexend font-bold text-slate-800 dark:text-white tracking-tight">
            Practice Complete 🎉
          </h1>
          <p className="text-base md:text-lg text-gray-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
            You’ve completed this revision session. Review your performance and continue your study flow.
          </p>
        </div>

        {/* 3. SESSION CONTEXT */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-full shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300">
            <BookOpen size={16} className="text-primary-500" />
            {session.course || 'Medical Course'} {session.discipline && `• ${session.discipline}`}
          </div>
          <div className="px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-full font-bold text-xs uppercase tracking-widest text-gray-500 dark:text-slate-400">
            {session.session_type === 'EXAM' ? 'Exam Mode' : 'Practice Mode'}
          </div>
        </div>

        {/* 2. CORE SESSION SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="glass bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 mb-3">
               <Trophy size={20} />
             </div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Score</p>
             <h3 className="text-2xl font-lexend font-bold text-slate-800 dark:text-white">{correctAnswers} / {session.total_questions}</h3>
          </div>

          {/* Card 2 */}
          <div className="glass bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-3">
               <Target size={20} />
             </div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Accuracy</p>
             <h3 className="text-2xl font-lexend font-bold text-slate-800 dark:text-white">{Math.round(scoreNum)}%</h3>
          </div>

          {/* Card 3 */}
          <div className="glass bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 mb-3">
               <ListChecks size={20} />
             </div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Questions</p>
             <h3 className="text-2xl font-lexend font-bold text-slate-800 dark:text-white">{session.total_questions}</h3>
          </div>

          {/* Card 4 */}
          <div className="glass bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
             <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 mb-3">
               <Clock size={20} />
             </div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Study Time</p>
             <h3 className="text-2xl font-lexend font-bold text-slate-800 dark:text-white">-- min</h3>
          </div>
        </div>

        {/* 4. PERFORMANCE INSIGHT */}
        <div className="bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 p-5 rounded-2xl flex items-start sm:items-center gap-4 max-w-2xl mx-auto shadow-sm">
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-primary-600 shrink-0">
            <Activity size={20} />
          </div>
          <p className="text-primary-800 dark:text-primary-200 font-medium text-sm md:text-base">
            {getPerformanceInsight(scoreNum)}
          </p>
        </div>

        <div className="h-px bg-gray-200 dark:bg-slate-800/60 max-w-md mx-auto my-8" />

        {/* 5. NEXT ACTIONS CTA */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
           {/* Primary Action */}
           <button 
             onClick={() => alert("Review mode not yet implemented")} 
             className="sm:col-span-3 btn-primary py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-primary-600/20 text-base group"
           >
             Review Answers <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
           </button>
           
           {/* Secondary Actions */}
           <button 
             onClick={() => navigate('/courses')} 
             className="glass bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
           >
             <ChevronLeft size={18} /> Back to Course
           </button>

           <button 
             onClick={() => navigate('/practice')} // Defaults to navigating safely back to /courses without ID
             className="glass bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
           >
             <RotateCcw size={18} /> Practice Again
           </button>

           <button 
             onClick={() => navigate('/dashboard')} 
             className="glass bg-transparent border border-dashed border-gray-300 dark:border-slate-700 py-4 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-gray-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors"
           >
             Go to Dashboard
           </button>
        </div>

      </div>
    </div>
  );
};

export default SessionResults;
