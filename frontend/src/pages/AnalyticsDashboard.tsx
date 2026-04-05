import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { practiceService } from '../api/practiceService';
import { 
  BarChart3, 
  Target, 
  Flame, 
  TrendingUp, 
  ChevronRight,
  BrainCircuit,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsDashboard: React.FC = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: practiceService.getAnalytics,
  });

  if (isLoading || !analytics) {
    return (
      <div className="h-full flex items-center justify-center p-20">
        <div className="text-center space-y-4">
          <Activity className="text-primary-600 mx-auto animate-spin" size={40} />
          <p className="font-lexend font-bold text-slate-500">Aggregating Clinical Performance Data...</p>
        </div>
      </div>
    );
  }

  const { summary, disciplines } = analytics;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-lexend font-bold text-slate-900 dark:text-white tracking-tight">Performance Hub</h2>
          <p className="text-slate-500 font-medium mt-1">Real-time tactical analysis of your academic progress.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary-600/20">Overall</button>
          <button className="px-4 py-2 text-slate-500 hover:text-primary-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">By Level</button>
          <button className="px-4 py-2 text-slate-500 hover:text-primary-600 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">History</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-600/5 rounded-full blur-2xl group-hover:bg-primary-600/10 transition-colors" />
          <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-600">
            <Target size={24} />
          </div>
          <div>
            <div className="text-3xl font-lexend font-bold">{summary.overall_accuracy}%</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Accuracy</div>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-600/5 rounded-full blur-2xl group-hover:bg-emerald-600/10 transition-colors" />
          <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-600">
            <BrainCircuit size={24} />
          </div>
          <div>
            <div className="text-3xl font-lexend font-bold">{summary.total_answered}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Vectors Analyzed</div>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-600/5 rounded-full blur-2xl group-hover:bg-amber-600/10 transition-colors" />
          <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-600">
            <Flame size={24} />
          </div>
          <div>
            <div className="text-3xl font-lexend font-bold">12 Days</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tactical Streak</div>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-600/5 rounded-full blur-2xl group-hover:bg-sky-600/10 transition-colors" />
          <div className="w-12 h-12 bg-sky-600/10 rounded-2xl flex items-center justify-center text-sky-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-3xl font-lexend font-bold">Top 5%</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Rank</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-10 rounded-[3rem] space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-lexend font-bold text-xl flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center"><BarChart3 size={18} /></span>
              Discipline Proficiency
            </h3>
          </div>

          <div className="space-y-6">
            {disciplines.map((d: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{d.question__discipline__name || 'General Core'}</span>
                  <span className="text-xs font-bold text-primary-600">{Math.round((d.correct / d.total) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.correct / d.total) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary-600 to-sky-500 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] space-y-8">
           <h3 className="font-lexend font-bold text-xl flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center"><Activity size={18} /></span>
              Intelligent Focus
            </h3>
            
            <div className="space-y-4">
              <div className="p-6 bg-rose-600/5 rounded-[2rem] border border-rose-600/10 group cursor-pointer hover:bg-rose-600/10 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-600/20">
                    <AlertCircle size={20} />
                  </div>
                  <ChevronRight className="text-rose-300 group-hover:translate-x-2 transition-transform" />
                </div>
                <h4 className="font-lexend font-bold text-rose-600">Mistake Bank</h4>
                <p className="text-xs text-rose-600/60 font-medium mt-1">14 deviations detected. Priority review required.</p>
              </div>

              <div className="p-6 bg-primary-600/5 rounded-[2rem] border border-primary-600/10 group cursor-pointer hover:bg-primary-600/10 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                    <TrendingUp size={20} />
                  </div>
                  <ChevronRight className="text-primary-300 group-hover:translate-x-2 transition-transform" />
                </div>
                <h4 className="font-lexend font-bold text-primary-600">Adaptive Path</h4>
                <p className="text-xs text-primary-600/60 font-medium mt-1">Recommended: Year 1 Anatomy - Upper Limb Simulation.</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// AlertCircle import fix
import { AlertCircle } from 'lucide-react';

export default AnalyticsDashboard;
