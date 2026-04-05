import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  PlusCircle, 
  LogOut,
  Activity,
  Search,
  Database
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const AdminLayout: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const adminNav = [
    { name: 'Admin Hub', icon: ShieldCheck, path: '/admin/dashboard' },
    { name: 'Manage Questions', icon: Database, path: '/admin/questions' },
    { name: 'Create Question', icon: PlusCircle, path: '/admin/questions/new' },
    { name: 'Curriculum Sync', icon: Search, path: '/admin/curriculum' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-inter">
      {/* Sidebar - Admin Specialist */}
      <aside className="hidden lg:flex flex-col w-72 glass border-r border-gray-200 dark:border-slate-800 h-screen sticky top-0 transition-all duration-500">
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/30">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-lexend font-bold text-xl tracking-tighter">SmartMed</span>
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em]">Command Center</span>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {adminNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-5 py-4 rounded-[1.5rem] transition-all duration-300 group
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-xl dark:bg-primary-600' 
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900'}
              `}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${item.path.includes('new') ? 'text-rose-500' : ''}`} />
              <span className="font-bold text-sm tracking-tight">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-gray-200 dark:border-slate-800 flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-4 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all group font-bold text-sm"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            Sign Out Command
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col relative">
        <header className="h-24 glass flex items-center justify-between px-10 z-30 sticky top-0 border-b border-gray-100 dark:border-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-xl font-lexend font-bold uppercase tracking-widest text-slate-400">Tactical Control Panel</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">Administrator</p>
              <p className="text-sm font-medium">Root Access Active</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white font-bold border-2 border-rose-500/20 shadow-lg">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 p-10 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
