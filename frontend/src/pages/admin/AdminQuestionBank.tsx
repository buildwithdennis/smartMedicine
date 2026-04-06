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
  ChevronDown,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import adminService from '../../services/adminService';
import { motion, AnimatePresence } from 'framer-motion';

const AdminQuestionBank: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'published' | 'draft' | 'archived'>('published');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('All Courses');
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<any | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        status: activeTab,
      };
      
      if (searchTerm) params.search = searchTerm;
      if (selectedCourse !== 'All Courses') {
        // Find the course ID for the selected course name
        const courseObj = availableCourses.find(c => c.name === selectedCourse);
        if (courseObj) params.course = courseObj.id;
      }

      const data = await adminService.getQuestions(params);
      
      // DRF Pagination Envelope: { count, next, previous, results }
      if (data && data.results) {
        setQuestions(data.results);
        setTotalCount(data.count);
      } else if (Array.isArray(data)) {
        setQuestions(data);
        setTotalCount(data.length);
      }
    } catch (error) {
      console.error('Failed to fetch questions', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const data = await adminService.getCurriculumStructure();
      // DRF Pagination Envelope check
      const levelList = Array.isArray(data) ? data : (data?.results || []);
      
      const allCourses: any[] = [];
      levelList.forEach((level: any) => {
        if (level.courses) {
          allCourses.push(...level.courses);
        }
      });
      setAvailableCourses(allCourses);
    } catch (error) {
      console.error('Failed to fetch courses', error);
    }
  };

  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, activeTab, selectedCourse]);

  // Handle Search with debounce or manual trigger
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchQuestions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question? This action cannot be undone.')) return;
    try {
      await adminService.deleteQuestion(id);
      fetchQuestions();
    } catch (error) {
      console.error('Delete failed', error);
      alert('Failed to delete question. It might be linked to active exam sessions.');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-8 animate-slide-up relative">
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
        <form onSubmit={handleSearch} className="relative flex-1 group">
          <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search question stems, keywords, or authors..." 
            className="w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none text-sm font-medium shadow-sm"
          />
          <button type="submit" className="hidden">Search</button>
        </form>
        <div className="flex gap-2 relative">
           <button 
             onClick={() => setIsFilterOpen(!isFilterOpen)}
             className={`flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border rounded-2xl text-sm font-bold transition-all shadow-sm ${
               isFilterOpen || selectedCourse !== 'All Courses' 
               ? 'border-primary-500 text-primary-500 bg-primary-500/5' 
               : 'border-gray-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
             }`}
           >
             <Filter size={18} /> {selectedCourse} <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
           </button>

           <AnimatePresence>
             {isFilterOpen && (
               <>
                 <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                 <motion.div 
                   initial={{ opacity: 0, y: 10, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: 10, scale: 0.95 }}
                   className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[1.5rem] shadow-2xl z-20 overflow-hidden"
                 >
                   <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                     <button
                         onClick={() => {
                           setSelectedCourse('All Courses');
                           setCurrentPage(1);
                           setIsFilterOpen(false);
                         }}
                         className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                           selectedCourse === 'All Courses' 
                           ? 'bg-primary-500 text-white' 
                           : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                         }`}
                       >
                         All Courses
                       </button>
                     {availableCourses.length === 0 ? (
                       <div className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse italic">
                         Syncing curriculum...
                       </div>
                     ) : (
                       availableCourses.map((course) => (
                         <button
                           key={course.id}
                           onClick={() => {
                             setSelectedCourse(course.name);
                             setCurrentPage(1);
                             setIsFilterOpen(false);
                           }}
                           className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                             selectedCourse === course.name 
                             ? 'bg-primary-500 text-white' 
                             : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                           }`}
                         >
                           {course.name}
                         </button>
                       ))
                     )}
                   </div>
                 </motion.div>
               </>
             )}
           </AnimatePresence>
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
            onClick={() => {
              setActiveTab(tab.id as any);
              setCurrentPage(1);
            }}
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
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="overflow-x-auto flex-1">
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
                  <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest text-sm italic">
                    Synchronizing Question Vault...
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                         <Archive size={32} />
                       </div>
                       <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">No questions found</p>
                       <button 
                         onClick={() => { setSearchTerm(''); setSelectedCourse('All Courses'); setCurrentPage(1); }}
                         className="text-xs font-bold text-primary-500 hover:underline mt-2"
                       >
                         Reset all filters
                       </button>
                    </div>
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id} className="group hover:bg-slate-50/30 dark:hover:bg-primary-500/5 transition-colors">
                    <td className="px-8 py-6 max-w-md">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mb-1 leading-relaxed">{q?.text || 'No Stem Provided'}</p>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-2">
                        By Platform Admin • 
                        <span className={`px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tighter ${
                          q.difficulty === 'hard' ? 'bg-rose-500/10 text-rose-500' :
                          q.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-emerald-500/10 text-emerald-500'
                        }`}>{q.difficulty}</span>
                      </p>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase tracking-wider block w-fit">{q?.course_name || 'General'}</span>
                        <span className="text-[10px] font-medium text-slate-500">{q?.discipline_name || 'Miscellaneous'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => setPreviewQuestion(q)}
                           className="p-2.5 text-slate-400 hover:text-primary-500 hover:bg-primary-500/10 rounded-xl transition-all"
                         >
                           <Eye size={18} />
                         </button>
                         <button 
                           onClick={() => navigate(`/admin/questions/edit/${q.id}`)}
                           className="p-2.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all"
                         >
                           <Edit size={18} />
                         </button>
                         <button 
                           onClick={() => handleDelete(q.id)}
                           className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                         >
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

        {/* PAGINATION CONTROLS */}
        {!loading && totalCount > pageSize && (
          <div className="px-8 py-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-white/5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Showing <span className="text-slate-800 dark:text-white">{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalCount)}</span> of <span className="text-slate-800 dark:text-white">{totalCount}</span> Questions
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = currentPage;
                  if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  
                  if (pageNum <= 0 || pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pageNum 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                        : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-all shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PREVIEW MODAL (Previous implementation remains same) */}
      <AnimatePresence>
        {previewQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-600/10 text-primary-600 flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-lexend font-bold text-xl">Tactical Preview</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{previewQuestion.id.slice(0, 8)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewQuestion(null)}
                  className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Question Stem</label>
                  <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[1.5rem] font-medium leading-relaxed italic border border-slate-100 dark:border-slate-800">
                    "{previewQuestion.text}"
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Response Options</label>
                  <div className="grid gap-3">
                    {previewQuestion.options?.map((opt: any, i: number) => (
                      <div 
                        key={i} 
                        className={`p-4 rounded-2xl flex items-center gap-4 transition-all border ${
                          opt.is_correct 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' 
                          : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-800'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          opt.is_correct ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-sm font-medium">{opt.text}</span>
                        {opt.is_correct && <CheckCircle2 size={16} className="ml-auto" />}
                      </div>
                    ))}
                  </div>
                </div>

                {previewQuestion.explanation && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Academic Explanation</label>
                    <div className="p-6 bg-sky-500/5 dark:bg-sky-500/10 rounded-[1.5rem] text-sm font-medium leading-relaxed border border-sky-500/10">
                      {previewQuestion.explanation}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 border-t border-gray-100 dark:border-slate-800 pt-8">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Level</p>
                    <p className="text-sm font-bold">{previewQuestion.level_name || 'Level 1'} </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Course</p>
                    <p className="text-sm font-bold">{previewQuestion.course_name}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Difficulty</p>
                    <p className="text-sm font-bold capitalize">{previewQuestion.difficulty}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-white/5 flex gap-4">
                <button 
                  onClick={() => { setPreviewQuestion(null); navigate(`/admin/questions/edit/${previewQuestion.id}`); }}
                  className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
                >
                  <Edit size={18} /> Edit Baseline
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminQuestionBank;
