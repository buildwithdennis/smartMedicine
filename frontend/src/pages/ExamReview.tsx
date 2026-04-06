import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { practiceService } from '../api/practiceService';
import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

const ExamReview: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  const { data: results, isLoading } = useQuery({
    queryKey: ['session-results', sessionId],
    queryFn: () => practiceService.getSessionResults(sessionId!),
    enabled: !!sessionId,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-bold">Loading Review Data...</p>
        </div>
      </div>
    );
  }

  if (!results) return <div>No review available</div>;

  const filteredQuestions = (results as any).questions?.filter((q: any) => {
    const studentAnswer = results.answers?.find((a: any) => a.question === q.id);
    const selectedOption = q.options.find((o: any) => o.id === studentAnswer?.selected_option);
    const isCorrect = selectedOption?.is_correct;

    const matchesFilter = filter === 'all' || (filter === 'correct' && isCorrect) || (filter === 'incorrect' && !isCorrect);
    return matchesFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="h-20 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 flex items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/exam-results/${sessionId}`)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div className="flex flex-col">
            <h2 className="font-lexend font-bold text-lg text-primary-400 truncate max-w-[200px] sm:max-w-md">
              {(results as any).exam_title || 'Medical Mock Exam'}
            </h2>
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{(results as any).session_type || 'Practice'} • {(results as any).questions?.length || 0} Questions</span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
             {(['all', 'correct', 'incorrect'] as const).map((f) => (
               <button
                 key={f}
                 onClick={() => setFilter(f)}
                 className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                   filter === f 
                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 {f}
               </button>
             ))}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-5xl w-full mx-auto p-6 lg:p-10 space-y-10 pb-24">
        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-white dark:bg-slate-900 p-4 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-800 dark:text-white">{results.answers?.filter((a: any) => {
                  const q = (results as any).questions?.find((q: any) => q.id === a.question);
                  return q?.options.find((o: any) => o.id === a.selected_option)?.is_correct;
                }).length || 0}</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Correct</p>
              </div>
           </div>
           <div className="bg-white dark:bg-slate-900 p-4 rounded-[1.5rem] border border-gray-100 dark:border-slate-800 flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center">
                <XCircle size={20} />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-800 dark:text-white">{(results.answers?.length || 0) - (results.answers?.filter((a: any) => {
                  const q = (results as any).questions?.find((q: any) => q.id === a.question);
                  return q?.options.find((o: any) => o.id === a.selected_option)?.is_correct;
                }).length || 0)}</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Incorrect</p>
              </div>
           </div>
        </div>

        {/* Question List */}
        <div className="space-y-10">
          {!filteredQuestions || filteredQuestions.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
               <p className="text-slate-500">No questions match your current filter.</p>
            </div>
          ) : filteredQuestions.map((q: any, i: number) => {
            const studentAnswer = results.answers?.find((a: any) => a.question === q.id);
            const selectedOption = q.options.find((o: any) => o.id === studentAnswer?.selected_option);
            const isCorrect = selectedOption?.is_correct;

            return (
              <motion.div 
                key={q.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 shadow-sm space-y-6"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600'}`}>
                    {isCorrect ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {isCorrect ? 'Correct Answer' : 'Incorrect Answer'}
                  </div>
                </div>

                <h3 className="text-lg font-medium text-slate-800 dark:text-white leading-relaxed">
                  {q.text}
                </h3>

                <div className="grid gap-3">
                   {q.options.map((opt: any) => {
                     const isSelected = opt.id === studentAnswer?.selected_option;
                     const isCorrectOpt = opt.is_correct;
                     
                     let bgClass = "bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-600 dark:text-slate-400";
                     if (isSelected && !isCorrectOpt) bgClass = "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 font-bold";
                     if (isCorrectOpt) bgClass = "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold";

                     return (
                       <div 
                         key={opt.id}
                         className={`p-4 rounded-2xl border-2 flex items-center gap-4 ${bgClass}`}
                       >
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isCorrectOpt ? 'bg-emerald-500 text-white' : isSelected ? 'bg-rose-500 text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
                            {isCorrectOpt ? <CheckCircle2 size={14} /> : isSelected ? <XCircle size={14} /> : ''}
                         </div>
                         <span className="flex-1">{opt.text}</span>
                       </div>
                     )
                   })}
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3">
                   <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm">
                     <Info size={18} /> Detailed Explanation
                   </div>
                   <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                     {q.explanation || "No explanation provided for this question."}
                   </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamReview;
