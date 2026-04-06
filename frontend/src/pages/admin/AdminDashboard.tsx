import React from 'react';
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  PlusCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import adminService from '../../services/adminService';
import type { AdminStats, AdminActivity } from '../../services/adminService';

const AdminDashboard: React.FC = () => {
  const [statsData, setStatsData] = React.useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = React.useState<AdminActivity[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, activity] = await Promise.all([
          adminService.getStats(),
          adminService.getActivity()
        ]);
        setStatsData(stats);
        setRecentActivity(activity.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Students', value: statsData?.total_students || '0', change: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Courses', value: statsData?.total_courses || '0', change: '0%', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Active Sessions', value: statsData?.active_sessions || '0', change: 'Live', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Total Questions', value: statsData?.total_questions || '0', change: '+150', icon: HelpCircle, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-lexend font-bold text-slate-800 dark:text-white">Command Center</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Platform overview and operational health.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <div className="px-4 py-2 bg-primary-500/10 text-primary-600 rounded-xl text-xs font-bold uppercase tracking-widest">
            Last Sync: 2m ago
          </div>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group glass p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.change.includes('+') || stat.change === 'Live' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold font-lexend text-slate-800 dark:text-white tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800/50 flex items-center justify-between">
            <h3 className="text-lg font-bold font-lexend text-slate-800 dark:text-white">Recent Platform Activity</h3>
            <button className="text-xs font-bold text-primary-500 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="p-2">
            {loading ? (
              <div className="p-8 text-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">
                Fetching Real-time Streams...
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium text-sm italic">
                No recent activity recorded.
              </div>
            ) : (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-primary-500 group-hover:text-white transition-colors">
                      {activity.user_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {activity.user_name} <span className="font-medium text-slate-400">performed {activity.session_type}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                        {new Date(activity.start_time).toLocaleTimeString()} - {activity.course_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${activity.status === 'IN_PROGRESS' ? 'bg-sky-500/10 text-sky-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {activity.status} {activity.score > 0 && `(${activity.score}%)`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* QUICK ACTIONS PANEL */}
        <div className="space-y-6">
           <div className="bg-primary-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-primary-600/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <h3 className="text-xl font-bold font-lexend mb-2 relative z-10">Quick Actions</h3>
              <p className="text-white/70 text-sm mb-6 relative z-10">Common administrative tasks for rapid deployment.</p>
              
              <div className="space-y-3 relative z-10">
                 <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group backdrop-blur-md border border-white/5">
                    <span className="text-sm font-bold">New Question</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group backdrop-blur-md border border-white/5">
                    <span className="text-sm font-bold">Add Student</span>
                    <PlusCircle size={16} className="group-hover:scale-110 transition-transform" />
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all group backdrop-blur-md border border-white/5 text-slate-900 bg-white">
                    <span className="text-sm font-bold">Sync Curriculum</span>
                    <TrendingUp size={16} />
                 </button>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 shadow-sm">
             <h4 className="text-sm font-bold font-lexend text-slate-800 dark:text-white mb-4">System Health</h4>
             <div className="space-y-4">
                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest text-emerald-500">
                      <span>Server Status: Online</span>
                      <span>99.9% Uptime</span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-[95%] bg-emerald-500 rounded-full" />
                   </div>
                </div>
                <div className="space-y-2 text-rose-500 font-bold text-xs bg-rose-500/5 p-4 rounded-2xl border border-rose-500/10">
                   Database Backup: 4h ago
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
