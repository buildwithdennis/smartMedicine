import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, FileSignature, Clock, Target, 
  BookOpen, Activity, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
      {/* 1. HERO WELCOME SECTION */}
      <div className="glass p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-gray-100 dark:border-slate-800 shadow-sm">
        <div className="absolute top-0 right-0 w-[40%] h-[150%] bg-gradient-to-bl from-primary-500/10 to-sky-500/5 blur-3xl pointer-events-none transform -translate-y-1/4 translate-x-1/4" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] bg-gradient-to-br from-primary-500 to-sky-500 flex items-center justify-center text-white shadow-xl shadow-primary-500/20 text-3xl sm:text-4xl font-bold font-lexend ring-4 ring-white/50 dark:ring-slate-900/50 flex-shrink-0">
            {user?.username?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-lexend font-bold tracking-tight text-slate-800 dark:text-white mb-2">
              {greeting}, <span className="bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent">{user?.username || 'Cadet'}</span> 👋
            </h1>
            <p className="text-sm font-bold text-primary-600 dark:text-primary-500 uppercase tracking-widest mb-3">
              {user?.registration_id || 'Level 200'} Medical Student
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md font-medium leading-relaxed bg-gray-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-slate-800">
              "Every question answered brings you closer to clinical mastery."
            </p>
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <button onClick={() => navigate('/courses')} className="group glass p-5 md:p-6 rounded-3xl flex items-center gap-5 hover:border-primary-500/30 hover:shadow-lg hover:-translate-y-1 transition-all text-left border border-white dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-primary-500/10 text-primary-600 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors flex-shrink-0">
            <PlayCircle size={26} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Start Practice</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Begin a new session</p>
          </div>
        </button>
        
        <button onClick={() => navigate('/courses')} className="group glass p-5 md:p-6 rounded-3xl flex items-center gap-5 hover:border-sky-500/30 hover:shadow-lg hover:-translate-y-1 transition-all text-left border border-white dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors flex-shrink-0">
            <FileSignature size={26} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Take Exam</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Simulate testing</p>
          </div>
        </button>

        <button className="group glass p-5 md:p-6 rounded-3xl flex items-center gap-5 hover:border-amber-500/30 hover:shadow-lg hover:-translate-y-1 transition-all text-left border border-white dark:border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors flex-shrink-0">
            <Clock size={26} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">Continue</h3>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Resume last session</p>
          </div>
        </button>
      </div>

      {/* 3. CORE PERFORMANCE STAT CARDS */}
      <div className="pt-4">
        <h2 className="text-lg font-lexend font-bold text-slate-800 dark:text-slate-200 px-2 mb-4">Performance Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {[
            { label: 'Questions Attempted', value: '1,240', icon: CheckCircle2, color: 'text-primary-500', bg: 'bg-primary-500/10' },
            { label: 'Accuracy Rate', value: '84.2%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { label: 'Study Hours', value: '42h', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Course Coverage', value: '68%', icon: Activity, color: 'text-sky-500', bg: 'bg-sky-500/10' },
          ].map((stat, i) => (
            <div key={i} className="glass p-5 md:p-6 rounded-[2rem] flex flex-col justify-between border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow">
               <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl mb-4 md:mb-5 flex items-center justify-center ${stat.bg} ${stat.color}`}>
                 <stat.icon size={22} className="w-5 h-5 md:w-6 md:h-6" />
               </div>
               <div>
                 <p className="text-[10px] md:text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1 md:mb-1.5">{stat.label}</p>
                 <h3 className="text-2xl md:text-3xl font-bold font-lexend tracking-tight text-slate-800 dark:text-white">{stat.value}</h3>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        {/* 4. CONTINUE LAST SESSION */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-lexend font-bold text-slate-800 dark:text-slate-200 px-2">Active Session</h2>
          <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-primary-500/30 transition-colors flex flex-col justify-between h-full min-h-[260px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="relative z-10">
               <div className="flex items-center gap-2 mb-5">
                 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-[pulse_2s_infinite]" />
                 <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">In Progress</span>
               </div>
               
               <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 leading-tight pr-4">Thorax Anatomy Practice</h3>
               
               <ul className="space-y-3">
                 <li className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                   <span className="text-xs font-medium text-gray-500">Progress</span>
                   <span className="text-sm text-slate-700 dark:text-slate-300 font-bold">8 / 20 Completed</span>
                 </li>
                 <li className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                   <span className="text-xs font-medium text-gray-500">Last Active</span>
                   <span className="text-sm text-slate-700 dark:text-slate-300 font-bold">2 hours ago</span>
                 </li>
                 <li className="flex items-center justify-between">
                   <span className="text-xs font-medium text-gray-500">Mode</span>
                   <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-500/10 px-2 py-1 rounded-md">Practice</span>
                 </li>
               </ul>
            </div>
            
            <button className="w-full mt-8 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-colors shadow-lg active:scale-95 relative z-10 border border-transparent">
              Resume Session
            </button>
          </div>
        </div>

        {/* 5. COURSE PROGRESS SECTION */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-lexend font-bold text-slate-800 dark:text-slate-200 px-2">Course Progress</h2>
          <div className="glass p-3 md:p-4 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm h-full flex flex-col justify-between">
            <div className="space-y-2">
              {[
                { name: 'Anatomy', p: 62, a: 320, acc: 68 },
                { name: 'Physiology', p: 48, a: 180, acc: 54 },
                { name: 'Biochemistry', p: 73, a: 400, acc: 72 },
                { name: 'Pathology', p: 24, a: 95, acc: 42 },
              ].map((course, i) => (
                <div key={i} className="bg-white/60 dark:bg-slate-950/40 p-4 md:p-6 rounded-[2rem] hover:bg-white dark:hover:bg-slate-900 transition-colors group cursor-default">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 dark:group-hover:bg-primary-500/10 transition-colors flex-shrink-0">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-base md:text-lg text-slate-800 dark:text-slate-200">{course.name}</h4>
                        <p className="text-xs font-medium text-gray-400 mt-0.5">{course.a} questions attempted</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 md:gap-8 self-end md:self-auto ml-16 md:ml-0">
                       <div className="text-right">
                         <p className="text-[10px] items-center font-bold text-gray-400 uppercase tracking-widest mb-1">Accuracy</p>
                         <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{course.acc}%</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Coverage</p>
                         <p className="text-sm font-bold text-primary-600 dark:text-primary-400">{course.p}%</p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden flex ml-16 md:ml-0 w-[calc(100%-4rem)] md:w-full">
                    <div className="bg-gray-800 dark:bg-gray-400 h-full rounded-full transition-all group-hover:bg-primary-500" style={{ width: `${course.p}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
