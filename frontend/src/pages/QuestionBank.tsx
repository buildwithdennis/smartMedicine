import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Target, Bookmark, PenTool, LayoutDashboard } from 'lucide-react';
import { questionService, type Question } from '../api/questionService';

const QuestionBank: React.FC = () => {
  const [searchParams] = useSearchParams();
  const disciplineId = searchParams.get('discipline');
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filters, setFilters] = React.useState({
    discipline: disciplineId || '',
    difficulty: '',
    question_type: '',
  });

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', filters, searchTerm],
    queryFn: () => questionService.getQuestions({ 
      ...filters, 
      search: searchTerm 
    }),
  });

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-lexend font-bold tracking-tight">Question Repository</h2>
          <p className="text-gray-500 dark:text-slate-400 font-medium">
            Search and review medical cases from the active question bank.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search concepts or key terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-6 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none min-w-[300px]"
            />
          </div>
          <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-gray-500 hover:bg-primary-500/10 hover:text-primary-600 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="space-y-6">
          <div className="glass p-6 rounded-[2rem] space-y-4">
            <h4 className="font-lexend font-bold text-sm uppercase tracking-widest text-primary-600 mb-4">Tactical Filters</h4>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">Difficulty</label>
              <select 
                value={filters.difficulty}
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">All Tiers</option>
                <option value="easy">Basic (Easy)</option>
                <option value="medium">Intermediate</option>
                <option value="hard">Expert (Hard)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-tighter">Question Type</label>
              <select 
                value={filters.question_type}
                onChange={(e) => setFilters(prev => ({ ...prev, question_type: e.target.value }))}
                className="w-full bg-gray-50 dark:bg-slate-900 border-none rounded-xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="">All Formats</option>
                <option value="SBA">Single Best Answer</option>
                <option value="MCQ">Multiple Choice</option>
              </select>
            </div>
          </div>

          <div className="glass p-6 rounded-[2rem] border-dashed border-2 border-primary-500/10 text-center">
            <PenTool className="mx-auto text-primary-500 mb-3" size={24} />
            <p className="font-bold text-sm mb-1">Session Planning</p>
            <p className="text-xs text-gray-400 mb-4">Build a custom mission from these filtered questions.</p>
            <button className="w-full btn-primary py-3 text-xs uppercase tracking-widest">
              Quick Practice
            </button>
          </div>
        </aside>

        {/* Question List */}
        <div className="lg:col-span-3 space-y-4">
          {isLoading ? (
            [1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-32 glass rounded-3xl animate-pulse bg-gray-100/50 dark:bg-slate-900/50" />
            ))
          ) : questions && questions.length > 0 ? (
            questions.map((question: Question) => (
              <div 
                key={question.id}
                className="glass p-6 rounded-3xl group hover:border-primary-500/50 transition-all cursor-pointer relative overflow-hidden flex flex-col md:flex-row gap-6 md:items-center"
              >
                <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-2xl flex-shrink-0 flex items-center justify-center text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <span className="font-lexend font-bold text-xs uppercase tracking-tighter">{question.question_type}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                      question.difficulty === 'hard' ? 'bg-rose-500/10 text-rose-500' :
                      question.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {question.difficulty} Tier
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reference: {question.source_year || '2026 Core'}</span>
                  </div>
                  <h3 className="font-medium text-slate-800 dark:text-slate-100 line-clamp-2 leading-relaxed">
                    {question.text}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl text-gray-400 hover:text-primary-500 transition-colors">
                    <Bookmark size={18} />
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 transition-all text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-primary-600/20 active:scale-95">
                    Explore <Target size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass p-20 rounded-[3rem] text-center space-y-4">
              <LayoutDashboard size={48} className="mx-auto text-gray-200" />
              <div>
                <p className="text-xl font-lexend font-bold text-gray-400">Tactical Data Unavailable</p>
                <p className="text-sm text-gray-400 max-w-xs mx-auto">Modify your filters or search keywords to locate questions in the repository.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
