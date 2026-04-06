import React, { useState, useEffect } from 'react';
import { 
  PlayCircle, FileSignature, BookOpen, Clock 
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
        
        <button onClick={() => navigate('/exams')} className="group glass p-5 md:p-6 rounded-3xl flex items-center gap-5 hover:border-sky-500/30 hover:shadow-lg hover:-translate-y-1 transition-all text-left border border-white dark:border-slate-800">
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

      {/* 3. CORE PERFORMANCE STAT CARDS - REMOVED PER USER REQUEST */}
      {/* 
      <div className="pt-4">
        ...
      </div>
      */}

      <div className="max-w-4xl mx-auto pt-10 space-y-4">
        {/* 5. COURSE PROGRESS SECTION */}
        <h2 className="text-lg font-lexend font-bold text-slate-800 dark:text-slate-200 px-2 text-center md:text-left tracking-wide uppercase text-[10px] text-primary-500 mb-2">Course Progress</h2>
        <div className="glass p-3 md:p-4 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
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
  );
};

export default Dashboard;
