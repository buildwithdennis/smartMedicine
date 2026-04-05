import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Hash } from 'lucide-react';
import { curriculumService, type Level } from '../api/curriculumService';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, setAuth, token } = useAuthStore();
  const [selectedLevelId, setSelectedLevelId] = React.useState<string | null>(null);
  const [registrationNumber, setRegistrationNumber] = React.useState<string>('');
  const { data: levels, isLoading } = useQuery({
    queryKey: ['levels'],
    queryFn: curriculumService.getLevels,
  });

  const handleComplete = async () => {
    if (!selectedLevelId || !registrationNumber.trim()) return;
    
    try {
      // Update profile in backend
      await api.patch('/auth/profile/', {
        level: selectedLevelId,
        registration_id: registrationNumber.trim()
      });
      
      // Update local state
      if (user && token) {
        setAuth({ ...user, registration_id: registrationNumber.trim() }, token);
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update level', error);
      alert('Failed to save selection. Please try again.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-lexend font-bold mb-2">Academic Baseline</h2>
        <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
          Select your current level to calibrate the platform.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center py-10 space-y-4">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Initialising system...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {levels?.map((level: Level) => (
            <button 
              key={level.id} 
              onClick={() => setSelectedLevelId(level.id)}
              className={`p-6 glass rounded-3xl border-2 transition-all group text-left relative overflow-hidden ${
                selectedLevelId === level.id 
                  ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10' 
                  : 'border-transparent hover:border-primary-500/30'
              }`}
            >
              <div className={`absolute top-0 right-0 w-16 h-16 bg-primary-500/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 ${selectedLevelId === level.id ? 'scale-150 bg-primary-500/10' : ''}`} />
              <Hash size={20} className={`mb-3 transition-colors ${selectedLevelId === level.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500'}`} />
              <p className="font-lexend font-bold text-lg">{level.name}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">Standard Content</p>
            </button>
          ))}
        </div>
      )}
      <div className="mt-8 bg-gray-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-gray-200 dark:border-slate-800">
        <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Registration Number</label>
        <p className="text-xs text-gray-400 mb-3">Please enter your assigned institution registration or matriculation ID.</p>
        <div className="relative group">
          <Hash className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            placeholder="e.g. PS/ITC/21/0001"
          />
        </div>
      </div>
      
      <button 
        disabled={!selectedLevelId || !registrationNumber.trim() || isLoading}
        onClick={handleComplete}
        className="w-full btn-primary py-4 mt-4 disabled:opacity-50 disabled:grayscale transition-all"
      >
        Complete Activation
      </button>
    </div>
  );
};

export default Onboarding;
