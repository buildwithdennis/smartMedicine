import React from 'react';
import { Outlet } from 'react-router-dom';
import { Activity } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-50 dark:bg-slate-950">
      {/* Decroative futuristic elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px]" />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-600/30 mb-4 transition-transform hover:scale-110 cursor-pointer">
            <Activity className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-lexend font-bold tracking-tight bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent">
            SmartMed LMS
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">
            Premium Medical Revision
          </p>
        </div>
        
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <Outlet />
        </div>
        
        <p className="text-center mt-8 text-sm text-gray-400 dark:text-slate-500">
          Built for future medical leaders.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
