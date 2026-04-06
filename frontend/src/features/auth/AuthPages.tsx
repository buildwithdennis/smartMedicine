import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../store/authStore';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import api from '../../api/axios';

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await api.post('/auth/login/', {
        username: data.username,
        password: data.password
      });
      
      const { access } = response.data;
      
      // Get full profile data
      const userResponse = await api.get('/auth/profile/', {
        headers: { Authorization: `Bearer ${access}` }
      });

      setAuth(userResponse.data, access);
      
      const user = userResponse.data;
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (!user.registration_id) {
        navigate('/auth/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed', error);
      alert('Authentication failed. Check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Username</label>
        <div className="relative group">
          <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            {...register('username')}
            className="w-full bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            placeholder="SearchID or Username"
          />
        </div>
        {errors.username && <p className="text-rose-500 text-xs mt-2 ml-4 font-medium">{errors.username.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Security Key</label>
        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="password"
            {...register('password')}
            className="w-full bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            placeholder="••••••••"
          />
        </div>
        {errors.password && <p className="text-rose-500 text-xs mt-2 ml-4 font-medium">{errors.password.message as string}</p>}
      </div>

      <button type="submit" className="w-full btn-primary py-4 text-lg font-lexend flex items-center justify-center gap-2">
        Initiate Session <ArrowRight size={20} />
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-slate-400">
        New cadet? <Link to="/auth/register" className="text-primary-600 font-bold hover:underline">Enroll Now</Link>
      </p>
    </form>
  );
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    setIsRegistering(true);
    setServerError(null);
    try {
      await api.post('/auth/register/', {
        username: data.username,
        email: data.email,
        password: data.password
      });

      const loginResponse = await api.post('/auth/login/', {
        username: data.username,
        password: data.password
      });

      const { access } = loginResponse.data;

      const userResponse = await api.get('/auth/profile/', {
        headers: { Authorization: `Bearer ${access}` }
      });

      setAuth(userResponse.data, access);
      
      const user = userResponse.data;
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/auth/onboarding');
      }
      
    } catch (error: any) {
      console.error('Registration failed', error);
      const backendError = error.response?.data?.username?.[0] || error.response?.data?.email?.[0] || 'Registration failed. Try a different username/email.';
      setServerError(backendError);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-fade-in">
      {serverError && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-medium text-center">
          {serverError}
        </div>
      )}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Username</label>
        <div className="relative group">
          <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            {...register('username')}
            className="w-full bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            placeholder="Unique Cadet ID"
          />
        </div>
        {errors.username && <p className="text-rose-500 text-xs mt-2 ml-4 font-medium">{errors.username.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Email</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="email"
            {...register('email')}
            className="w-full bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            placeholder="student@medical.edu"
          />
        </div>
        {errors.email && <p className="text-rose-500 text-xs mt-2 ml-4 font-medium">{errors.email.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Security Key</label>
        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="password"
            {...register('password')}
            className="w-full bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            placeholder="••••••••"
          />
        </div>
        {errors.password && <p className="text-rose-500 text-xs mt-2 ml-4 font-medium">{errors.password.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-slate-300 mb-2">Confirm Key</label>
        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input 
            type="password"
            {...register('confirmPassword')}
            className="w-full bg-gray-50/50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            placeholder="••••••••"
          />
        </div>
        {errors.confirmPassword && <p className="text-rose-500 text-xs mt-2 ml-4 font-medium">{errors.confirmPassword.message as string}</p>}
      </div>

      <button disabled={isRegistering} type="submit" className="w-full btn-primary py-4 text-lg font-lexend flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4">
        {isRegistering ? 'Processing Data...' : 'Complete Enrollment'} <ArrowRight size={20} />
      </button>

      <p className="text-center text-sm text-gray-500 dark:text-slate-400 pt-2">
        Already a cadet? <Link to="/auth/login" className="text-primary-600 font-bold hover:underline">Access Terminal</Link>
      </p>
    </form>
  );
};
