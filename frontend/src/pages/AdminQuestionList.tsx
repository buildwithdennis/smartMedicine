import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { questionService, type Question } from '../api/questionService';
import api from '../api/axios';

const AdminQuestionList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: questions, isLoading } = useQuery({
    queryKey: ['admin-questions', searchTerm],
    queryFn: () => questionService.getQuestions({ search: searchTerm }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/questions/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      api.patch(`/questions/${id}/`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Terminate this question record permanently?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-lexend font-bold">Content Repository</h2>
          <p className="text-slate-500 font-medium tracking-tight">System-wide question management and validation.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/questions/new')}
          className="btn-primary py-4 px-8 flex items-center gap-2 bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
        >
          <Plus size={20} /> Create New Entry
        </button>
      </div>

      <div className="glass p-8 rounded-[2rem] space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by text, ID, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-3.5 pl-12 pr-6 focus:ring-2 focus:ring-rose-500/20 outline-none font-medium"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-colors flex items-center gap-2">
              <Filter size={16} /> Advanced Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Tactical ID</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Content Snapshot</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Context</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.1em] text-slate-400">Status</th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-[0.1em] text-slate-400 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse"><td colSpan={5} className="h-16 bg-slate-50/50 dark:bg-slate-900/50"></td></tr>
                ))
              ) : questions?.map((q: Question) => (
                <tr key={q.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-5 font-mono text-xs text-slate-400">{q.id.slice(0, 8)}</td>
                  <td className="px-6 py-5 max-w-sm">
                    <p className="font-medium text-sm line-clamp-1 mb-1">{q.text}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{q.question_type}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        q.difficulty === 'hard' ? 'text-rose-500' : 
                        q.difficulty === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                      }`}>{q.difficulty} Tier</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <p className="text-xs font-bold">L100 / Anatomy</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">General Core</p>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      q.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' :
                      q.status === 'draft' ? 'bg-slate-500/10 text-slate-400' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {q.status === 'published' ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {q.status}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => statusMutation.mutate({ id: q.id, status: q.status === 'published' ? 'draft' : 'published' })}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-primary-600 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/questions/edit/${q.id}`)}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(q.id)}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminQuestionList;
