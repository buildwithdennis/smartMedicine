import React from 'react';
import { 
  BarChart3, 
  Award, 
  Users, 
  TrendingUp, 
  Calendar,
  Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';
import adminService from '../../services/adminService';
import type { AdminActivity, AdminStats } from '../../services/adminService';

const ExamActivity: React.FC = () => {
  const [activities, setActivities] = React.useState<AdminActivity[]>([]);
  const [stats, setStats] = React.useState<AdminStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityData, statsData] = await Promise.all([
          adminService.getActivity(),
          adminService.getStats()
        ]);
        const activityList = Array.isArray(activityData) ? activityData : (activityData?.results || []);
        setActivities(activityList);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch activity data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-lexend font-bold text-slate-800 dark:text-white">Exam Activity Monitor</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Real-time oversight of assessment engine usage.</p>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl font-bold text-sm shadow-sm">
           <Monitor size={18} className="text-emerald-500" />
           <span className="text-emerald-500">Live Oversight: Active</span>
        </div>
      </header>

      {/* METRICS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Questions Bank', value: stats?.total_questions || '0', icon: Award, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Active Sessions', value: stats?.active_sessions || '0', icon: Users, color: 'text-primary-500', bg: 'bg-primary-500/10' },
          { label: 'Completion Rate', value: `${stats?.completion_rate || 0}%`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((metric, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 p-8 shadow-sm flex items-center gap-6">
             <div className={`w-16 h-16 rounded-2xl ${metric.bg} ${metric.color} flex items-center justify-center`}>
                <metric.icon size={28} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{metric.label}</p>
                <h3 className="text-3xl font-bold font-lexend text-slate-800 dark:text-white tracking-tight">{metric.value}</h3>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LIVE ACTIVITY FEED */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800/50 flex items-center justify-between">
            <h3 className="text-lg font-bold font-lexend text-slate-800 dark:text-white">Sessional Activity Feed</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Feed
            </div>
          </div>
          
          <div className="p-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 border-b border-gray-50 dark:border-slate-800">
                    <th className="px-6 py-4">Assessment Type</th>
                    <th className="px-6 py-4">Cadet</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">
                        Streaming Operational Data...
                      </td>
                    </tr>
                  ) : activities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-medium text-sm italic">
                        No active or recent assessment sessions found.
                      </td>
                    </tr>
                  ) : (
                    activities.map((act, i) => (
                      <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-primary-500/5 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                             <BarChart3 size={16} className="text-slate-400" />
                             <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{act?.session_type || 'Unknown Session'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-medium text-slate-500">{act?.user_name || 'System'}</span>
                        </td>
                        <td className="px-6 py-5">
                           <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                             act?.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' :
                             act?.status === 'IN_PROGRESS' ? 'bg-sky-500/10 text-sky-500' :
                             'bg-rose-500/10 text-rose-500'
                           }`}>
                             {act?.status || 'UNKNOWN'} {act?.score !== null && act?.score > 0 && `(${act.score}%)`}
                           </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <span className="text-[10px] text-slate-400 font-bold font-lexend tracking-widest">
                             {act?.start_time ? new Date(act.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                           </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RECENT PERFORMANCE OVERVIEW */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 shadow-sm">
           <h3 className="text-lg font-bold font-lexend text-slate-800 dark:text-white mb-6">Subject Engagement</h3>
           
           <div className="space-y-6">
              {[
                { label: 'Anatomy', sessions: 1240, progress: 85, color: 'bg-primary-500' },
                { label: 'Biochemistry', sessions: 840, progress: 62, color: 'bg-indigo-500' },
                { label: 'Pathology', sessions: 920, progress: 74, color: 'bg-sky-500' },
                { label: 'Physiology', sessions: 710, progress: 54, color: 'bg-rose-500' },
              ].map((sub, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-slate-500 dark:text-slate-400">{sub.label}</span>
                      <span className="text-slate-800 dark:text-white">{sub.sessions} Sessions</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sub.progress}%` }}
                        transition={{ delay: i * 0.1, duration: 1 }}
                        className={`h-full ${sub.color} rounded-full`} 
                      />
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-10 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-slate-800 text-center">
              <Calendar className="mx-auto text-primary-500 mb-2" size={24} />
              <p className="text-sm font-bold text-slate-800 dark:text-white">Monthly Report Ready</p>
              <button className="text-primary-500 text-[10px] font-bold uppercase tracking-widest mt-2 hover:underline">Download Analytics</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExamActivity;
