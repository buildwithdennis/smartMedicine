import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Zap, Target } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter overflow-hidden relative">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[150px] animate-pulse delay-700" />
      
      {/* Top Navigation */}
      <nav className="h-24 flex items-center justify-between px-6 lg:px-20 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-lexend font-bold text-2xl tracking-tighter">SmartMed</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/auth/login" className="text-gray-400 hover:text-white font-medium transition-colors">SignIn</Link>
          <Link to="/auth/register" className="px-6 py-2.5 bg-white text-slate-950 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
            Enroll Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
          <Zap size={14} className="animate-bounce" /> The Future of Medical Revision
        </div>
        
        <h1 className="text-6xl lg:text-8xl font-lexend font-bold mb-8 tracking-tighter animate-slide-up leading-tight">
          Master the <br />
          <span className="bg-gradient-to-r from-primary-400 to-sky-400 bg-clip-text text-transparent">
            Medical Mission.
          </span>
        </h1>
        
        <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          The premium question bank and exam simulation platform for future medical leaders. 
          Precision learning. Futuristic interface. Proven results.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/auth/login" className="btn-primary py-4 px-12 text-xl font-lexend h-auto w-full sm:w-auto">
            Launch Platform
          </Link>
          <div className="flex items-center gap-4 px-6 text-slate-500 text-sm font-medium italic">
            "Trusted by top-tier medical candidates."
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { icon: Target, title: 'Precision Content', desc: 'Curriculum-aligned question banks updated daily.' },
            { icon: Shield, title: 'Tactical Simulation', desc: 'Timed mock exams that replicate high-stakes environments.' },
            { icon: Activity, title: 'Advanced Analytics', desc: 'Deep-dive into performance data to identify weak points.' },
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary-500/30 transition-all group text-left">
              <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-500 mb-6 group-hover:scale-110 transition-transform">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-lexend font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Futuristic Background Grids */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      <div className="absolute left-1/2 bottom-0 w-[120%] aspect-square -translate-x-1/2 translate-y-1/2 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(14,165,233,0.05),transparent)] rounded-full blur-[100px]" />
    </div>
  );
};

export default LandingPage;
