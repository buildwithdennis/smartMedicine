import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  PenTool, 
  History, 
  Bookmark, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  ChevronRight,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Courses', icon: BookOpen, path: '/courses' },
    { name: 'Exams', icon: History, path: '/exams' },
    { name: 'Bookmarks', icon: Bookmark, path: '/bookmarks' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-950 font-inter">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 glass border-r border-gray-200 dark:border-slate-800 h-screen sticky top-0 transition-all duration-500">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-lexend font-bold text-xl bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent">
            SmartMed
          </span>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 active-nav' 
                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-900'}
              `}
            >
              <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-medium">{item.name}</span>
              {/* Optional indicator dots/chevrons */}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-200 dark:border-slate-800 space-y-1">
          <NavLink
            to="/profile"
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-2xl transition-all
              ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900'}
            `}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col relative">
        {/* Top Header */}
        <header className="h-20 glass flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0 border-b border-gray-100 dark:border-slate-800/50">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-500"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-lexend font-bold text-slate-800 dark:text-white hidden sm:block">
              Portal Home
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
                {user?.role || 'Student'}
              </span>
              <span className="text-sm text-gray-400 dark:text-slate-500">
                {user?.registration_id || 'Level 100'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-sky-400 border-2 border-white dark:border-slate-800 shadow-sm" />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10 animate-slide-up">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl animate-fade-in flex flex-col">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="text-primary-600 w-6 h-6" />
                <span className="font-lexend font-bold text-xl">SmartMed</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* nav content similar to desktop */}
          </aside>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
