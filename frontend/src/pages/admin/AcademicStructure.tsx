import React from 'react';
import { 
  Plus, 
  ChevronRight, 
  MoreVertical, 
  Layout, 
  BookOpen,
  Trash2,
  Edit2,
  X,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import adminService from '../../services/adminService';

const AcademicStructure: React.FC = () => {
  const [hierarchy, setHierarchy] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  // MODAL STATE
  const [modal, setModal] = React.useState<{
    type: 'level' | 'course' | 'discipline' | null,
    mode: 'create' | 'edit',
    data?: any,
    parentId?: number
  }>({ type: null, mode: 'create' });

  const fetchStructure = async () => {
    try {
      const data = await adminService.getCurriculumStructure();
      const levels = Array.isArray(data) ? data : (data?.results || []);
      setHierarchy(levels);
    } catch (error) {
      console.error('Failed to fetch hierarchy', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStructure();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      if (modal.type === 'level') {
        if (modal.mode === 'create') await adminService.createLevel(payload);
        else await adminService.updateLevel(modal.data.id, payload);
      } else if (modal.type === 'course') {
        if (modal.mode === 'create') await adminService.createCourse({ ...payload, level: modal.parentId });
        else await adminService.updateCourse(modal.data.id, payload);
      } else if (modal.type === 'discipline') {
        if (modal.mode === 'create') await adminService.createDiscipline({ ...payload, course: modal.parentId });
        else await adminService.updateDiscipline(modal.data.id, payload);
      }
      
      setModal({ type: null, mode: 'create' });
      fetchStructure();
    } catch (error) {
      console.error('Save failed', error);
      alert('Operation failed. Please check your data.');
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Are you absolutely sure? This action cannot be undone and may delete child items.')) return;
    
    try {
      if (type === 'level') await adminService.deleteLevel(id.toString());
      else if (type === 'course') await adminService.deleteCourse(id.toString());
      else if (type === 'discipline') await adminService.deleteDiscipline(id.toString());
      fetchStructure();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">
        Constructing Academic Hierarchy...
      </div>
    );
  }

  return (
    <div className="space-y-10 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-lexend font-bold text-slate-800 dark:text-white">Academic Hierarchy</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage Levels, Courses, and Disciplines.</p>
        </div>
        <button 
          onClick={() => setModal({ type: 'level', mode: 'create' })}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all active:scale-95"
        >
          <Plus size={18} /> Add New Level
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {!hierarchy || hierarchy.length === 0 ? (
          <div className="p-20 text-center text-slate-400 font-medium text-sm italic">
            No academic levels defined in the curriculum.
          </div>
        ) : (
          hierarchy.map((level: any, i: number) => (
            <motion.div 
              key={level?.id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden group/level"
            >
              <div className="px-10 py-8 bg-slate-50 dark:bg-white/5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <Layout size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-lexend text-slate-800 dark:text-white">{level?.name || 'Untitled Level'}</h3>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{level?.code || 'LVL'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover/level:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setModal({ type: 'level', mode: 'edit', data: level })}
                    className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-primary-500 shadow-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete('level', level.id)}
                    className="p-3 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {level?.courses?.map((course: any, j: number) => (
                    <div key={course?.id || j} className="p-6 bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800 rounded-[2rem] hover:border-primary-500/20 transition-all group/course">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover/course:bg-primary-500 group-hover/course:text-white transition-colors">
                            <BookOpen size={20} />
                          </div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">{course?.name || 'Untitled Course'}</h4>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover/course:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setModal({ type: 'course', mode: 'edit', data: course })}
                            className="p-2 text-slate-400 hover:text-primary-500"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete('course', course.id)}
                            className="p-2 text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Disciplines ({course?.disciplines?.length || 0})</p>
                        <div className="flex flex-wrap gap-2">
                          {(course?.disciplines || []).map((disc: any, k: number) => (
                            <span 
                              key={disc?.id || k} 
                              className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2 border border-transparent hover:border-primary-500/20 group/disc relative pr-8"
                            >
                              {disc?.name || 'Untitled'}
                              <button 
                                onClick={() => handleDelete('discipline', disc.id)}
                                className="absolute right-1 opacity-0 group-hover/disc:opacity-100 p-1 hover:text-rose-500 transition-all"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                          <button 
                            onClick={() => setModal({ type: 'discipline', mode: 'create', parentId: course.id })}
                            className="px-3 py-1.5 border border-dashed border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all font-lexend"
                          >
                            + Add Discipline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => setModal({ type: 'course', mode: 'create', parentId: level.id })}
                    className="border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-center text-slate-400 hover:text-primary-500 hover:border-primary-500/20 transition-all group/addcourse"
                  >
                    <Plus size={32} className="mb-2 group-hover/addcourse:scale-110 transition-transform" />
                    <span className="font-bold text-sm">Add Course under {(level?.name || 'Level').toString().split(' ')[0]}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* DYNAMIC MODAL SYSTEM */}
      <AnimatePresence>
        {modal.type && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 bg-slate-50 dark:bg-white/5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold font-lexend text-slate-800 dark:text-white flex items-center gap-3">
                   <span className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg">
                      {modal.type === 'level' ? <Layout size={20}/> : <BookOpen size={20}/>}
                   </span>
                   {modal.mode === 'create' ? `New ${modal.type}` : `Edit ${modal.type}`}
                </h3>
                <button onClick={() => setModal({ type: null, mode: 'create' })} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Title / Name</label>
                  <input 
                    name="name"
                    required
                    defaultValue={modal.data?.name || ''}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-primary-500/20 rounded-2xl p-4 outline-none font-bold text-slate-700 dark:text-slate-200 transition-all"
                    placeholder={`e.g., ${modal.type === 'level' ? 'Level 100' : modal.type === 'course' ? 'Anatomy' : 'Upper Limb'}`}
                  />
                </div>

                {modal.type === 'level' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Numerical Order</label>
                    <input 
                      name="order"
                      type="number"
                      required
                      defaultValue={modal.data?.order || ''}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-primary-500/20 rounded-2xl p-4 outline-none font-bold text-slate-700 dark:text-slate-200 transition-all"
                      placeholder="e.g., 1, 2, 3..."
                    />
                  </div>
                )}

                {modal.type === 'course' && (
                   <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Course Code</label>
                    <input 
                      name="code"
                      defaultValue={modal.data?.code || ''}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-primary-500/20 rounded-2xl p-4 outline-none font-bold text-slate-700 dark:text-slate-200 transition-all"
                      placeholder="e.g., ANA100"
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setModal({ type: null, mode: 'create' })}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                  >
                    {modal.mode === 'create' ? 'Create Node' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademicStructure;
