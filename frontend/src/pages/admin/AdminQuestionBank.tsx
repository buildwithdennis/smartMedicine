import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  Archive,
  ChevronDown
} from 'lucide-react';
import adminService from '../../services/adminService';

const AdminQuestionBank: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'published' | 'draft' | 'archived'>('published');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const data = await adminService.getQuestions();
        const questionList = Array.isArray(data) ? data : (data?.results || []);
        setQuestions(questionList);
      } catch (error) {
        console.error('Failed to fetch questions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter(q => q?.status === activeTab);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-lexend font-bold text-slate-800 dark:text-white">Question Bank</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage platform-wide clinical and basic science questions.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/questions/new')}
          className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all active:scale-95 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Create New Question
        </button>
      </header>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search question stems, keywords, or authors..." 
            className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm font-medium shadow-sm"
          />
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
             <Filter size={18} /> Filters
           </button>
           <button className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
             Course <ChevronDown size={16} />
           </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-4 border-b border-gray-100 dark:border-slate-800 pb-px">
        {[
          { id: 'published', label: 'Published', icon: CheckCircle2 },
          { id: 'draft', label: 'Drafts', icon: FileText },
          { id: 'archived', label: 'Archived', icon: Archive },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative border-b-2 ${
              activeTab === tab.id 
              ? 'text-primary-500 border-primary-500' 
              : 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* QUESTION LIST */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Question Details</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Category</th>
                <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">
                    Synchronizing Question Vault...
                  </td>
                </tr>
              ) : filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                         <Archive size={32} />
                       </div>
                       <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">No questions in this vault</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((q) => (
                  <tr key={q.id} className="group hover:bg-slate-50/30 dark:hover:bg-primary-500/5 transition-colors">
                    <td className="px-8 py-6 max-w-md">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">{q?.text || 'No Stem Provided'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">By Platform Admin • Updated recently</p>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col gap-1">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-wider">{q?.course_name || 'Course'}</span>
                        <span className="text-[10px] font-medium text-slate-500">{q?.discipline_name || 'Discipline'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                         <button className="p-2.5 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-xl transition-all">
                           <Eye size={18} />
                         </button>
                         <button 
                           onClick={() => navigate(`/admin/questions/${q.id}`)}
                           className="p-2.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all"
                         >
                           <Edit size={18} />
                         </button>
                         <button className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminQuestionBank;
