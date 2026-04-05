import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { practiceService } from '../api/practiceService';
import { 
  AlertCircle, 
  ChevronLeft, 
  Search, 
  Filter, 
  BookOpen,
  ArrowRight,
  Activity
} from 'lucide-react';

const MistakeBank: React.FC = () => {
  const navigate = useNavigate();
  const { data: mistakes, isLoading } = useQuery({
    queryKey: ['mistakes'],
    queryFn: practiceService.getMistakes,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-20">
        <Activity className="text-rose-600 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-500 hover:text-rose-600 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-4xl font-lexend font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              Mistake Bank
              <span className="px-3 py-1 bg-rose-600/10 text-rose-600 rounded-full text-xs font-bold">{mistakes?.length || 0}</span>
            </h2>
            <p className="text-slate-500 font-medium mt-1">Targeted remediation of tactical deviations.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search deviations..."
              className="pl-12 pr-6 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-rose-500/20 outline-none w-64 transition-all"
            />
          </div>
          <button className="p-3 glass rounded-2xl text-slate-500 hover:text-rose-600 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {!mistakes || mistakes.length === 0 ? (
        <div className="glass p-20 rounded-[3rem] text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto text-emerald-600">
            <BookOpen size={40} />
          </div>
          <h3 className="text-2xl font-lexend font-bold">Vector Clean</h3>
          <p className="text-slate-500 max-w-md mx-auto">No tactical deviations detected. Your clinical decision matrix is performing at optimal efficiency.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mistakes.map((q) => (
            <div 
              key={q.id}
              className="glass p-8 rounded-[2.5rem] flex flex-col justify-between group hover:border-rose-500/30 transition-all cursor-pointer shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:shadow-rose-600/10"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest bg-rose-600/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <AlertCircle size={10} /> Remediation Required
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{q.difficulty} Tier</span>
                </div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200 line-clamp-3 leading-relaxed">
                  {q.text}
                </h4>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div className="flex gap-2">
                   <div className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    {q.question_type}
                   </div>
                </div>
                <button className="w-10 h-10 bg-slate-50 dark:bg-slate-900 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all shadow-inner">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MistakeBank;
