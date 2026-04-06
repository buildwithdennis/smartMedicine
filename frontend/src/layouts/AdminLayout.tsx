import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  HelpCircle, 
  Users, 
  Activity,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Search,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const AdminLayout: React.FC = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Academic Structure', icon: Layers, path: '/admin/structure' },
    { name: 'Question Bank', icon: HelpCircle, path: '/admin/questions' },
    { name: 'Students', icon: Users, path: '/admin/students' },
    { name: 'Exam Activity', icon: Activity, path: '/admin/activity' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-inter">
      
      {/* SIDEBAR - SLEEK & PREMIUM */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 h-screen sticky top-0 z-40 transition-all duration-500 shadow-[20px_0_40px_rgba(0,0,0,0.02)]">
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-600 rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-primary-600/30 transform transition-transform hover:rotate-6">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-lexend font-bold text-xl tracking-tighter text-slate-800 dark:text-white">SmartMed</span>
            <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em] -mt-0.5">Control Center</span>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-5 py-4 rounded-[1.2rem] transition-all duration-300 group
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10 dark:bg-primary-600 dark:shadow-primary-600/20' 
                  : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'group-hover:text-primary-500'}`} />
                  <span className="font-bold text-sm tracking-tight">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-gray-100 dark:border-slate-800 flex flex-col gap-3">
           <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-transparent">
              <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white font-bold text-xs uppercase">
                 {user?.username?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 truncate">
                 <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user?.username || 'Admin'}</p>
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest truncate">Platform Admin</p>
              </div>
           </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-5 py-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all group font-bold text-sm border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
          >
            <div className="flex items-center gap-3">
               <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               Sign Out Hub
            </div>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col relative overflow-y-auto">
        {/* TOP BAR */}
        <header className="h-24 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-10 z-30 sticky top-0 transition-all">
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex relative group max-w-sm">
               <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Quick search questions or students..." 
                 className="bg-slate-100/50 dark:bg-slate-900/50 border border-transparent focus:border-primary-500/20 rounded-[1.2rem] py-2.5 pl-12 pr-6 outline-none text-sm font-medium transition-all w-80"
               />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-900 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
             </button>
             <div className="h-10 w-px bg-slate-100 dark:bg-slate-800 mx-2" />
             <div className="flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Server</span>
                <span className="text-xs font-bold text-emerald-500">Node-Alpha-01</span>
             </div>
          </div>
        </header>

        {/* CONTENT ENVELOPE */}
        <div className="flex-1 p-8 lg:p-12 animate-fade-in relative">
          <div className="max-w-[1600px] mx-auto">
             <Outlet />
          </div>
          
          {/* Subtle Background Pattern */}
          <div className="fixed bottom-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
          <div className="fixed top-24 left-72 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
