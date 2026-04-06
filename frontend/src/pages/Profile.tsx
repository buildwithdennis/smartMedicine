import React from 'react';
import {
  User,
  Mail,
  Fingerprint,
  BookOpen,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Settings,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="max-w-3xl mx-auto pb-20 space-y-8 animate-fade-in">

      {/* HEADER SECTION - MINIMAL & PREMIUM */}
      <section className="flex flex-col md:flex-row items-center gap-6 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-10 -mt-10" />

        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary-500 to-sky-500 p-1 shadow-lg shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[1.8rem] flex items-center justify-center text-3xl font-bold font-lexend text-white uppercase">
            {user?.username?.charAt(0) || 'S'}
          </div>
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl md:text-3xl font-lexend font-bold text-slate-800 dark:text-white mb-1">
            {user?.username || 'Medical Student'}
          </h1>
          <p className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">
            {user?.registration_id || 'ITC/24/0001'}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400">
              <BookOpen size={14} className="text-primary-500" /> 4th Year Clinical
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" /> Active Student
            </span>
          </div>
        </div>
      </section>

      {/* CORE INFO & ACTIONS */}
      <div className="grid grid-cols-1 gap-6">

        {/* ACCOUNT DETAILS */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50 dark:border-slate-800/50 flex items-center gap-3 bg-gray-50/30 dark:bg-slate-800/20">
            <Settings size={18} className="text-primary-500" />
            <h3 className="text-sm font-bold font-lexend text-slate-700 dark:text-slate-200 uppercase tracking-wider">Account Information</h3>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-transparent dark:border-slate-800/50 transition-all hover:border-primary-500/30">
                  <User size={16} className="text-gray-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{user?.username}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-transparent dark:border-slate-800/50 transition-all hover:border-primary-500/30">
                  <Mail size={16} className="text-gray-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{user?.email}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Registration ID</label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-transparent dark:border-slate-800/50">
                  <Fingerprint size={16} className="text-gray-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{user?.registration_id}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Role / Status</label>
                <div className="flex items-center gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100/50 dark:border-emerald-500/10">
                  <ShieldCheck size={16} className="text-emerald-500" />
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 capitalize">{user?.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK PREFERENCES */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-50 dark:border-slate-800/50 flex items-center gap-3 bg-gray-50/30 dark:bg-slate-800/20">
            <Bell size={18} className="text-primary-500" />
            <h3 className="text-sm font-bold font-lexend text-slate-700 dark:text-slate-200 uppercase tracking-wider">Preferences</h3>
          </div>

          <div className="p-4">
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-2xl transition-all group">
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Email Notifications</p>
                <p className="text-xs text-secondary-400">Receive exam and practice reminders</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-slate-800/50 rounded-2xl transition-all group mt-1">
              <div className="text-left">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Change Password</p>
                <p className="text-xs text-secondary-400">Update your security credentials</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="p-2 pt-4">
          <button
            onClick={logout}
            className="w-full py-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/5 dark:hover:bg-rose-500/10 text-rose-600 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-rose-100 dark:border-rose-500/20"
          >
            <LogOut size={20} />
            Log out from SmartMed
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
