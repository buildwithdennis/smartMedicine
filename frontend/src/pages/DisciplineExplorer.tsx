import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, PlayCircle, Layers, ChevronRight } from 'lucide-react';
import { curriculumService, type Discipline } from '../api/curriculumService';

// Helper description matching CourseExplorer
const getCourseDescription = (name: string) => {
  const descriptions: Record<string, string> = {
    'Anatomy': 'Core human structure and systems',
    'Physiology': 'Study of body functions and mechanisms',
    'Biochemistry': 'Chemical foundations of life and medicine',
    'Pathology': 'Nature and causes of disease processes',
    'Pharmacology': 'Drug action and therapeutic mechanisms',
    'Microbiology': 'Study of microscopic organisms and hosts',
    'default': 'Core medical sciences curriculum block'
  };
  return descriptions[name] || descriptions['default'];
};

const DisciplineExplorer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => curriculumService.getCourses(),
  });
  const currentCourse = courses?.find(c => c.id === courseId);

  const { data: disciplines, isLoading } = useQuery({
    queryKey: ['disciplines', courseId],
    queryFn: () => curriculumService.getDisciplines(courseId),
    enabled: !!courseId,
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl mx-auto">
      {/* 1. BACK CONTROLS */}
      <button 
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 px-1 py-2 text-gray-500 hover:text-primary-600 transition-colors font-bold text-sm group"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Library
      </button>

      {/* 2. COURSE TOP HEADER */}
      <div className="text-center py-6 md:py-10">
         <h1 className="text-4xl md:text-5xl font-lexend font-bold text-slate-800 dark:text-white mb-3">
           {currentCourse?.name || 'Loading Course...'}
         </h1>
         <p className="text-base text-gray-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
           {currentCourse ? getCourseDescription(currentCourse.name) : 'Loading...'}
         </p>
      </div>

      {/* 3. BROAD COURSE PRACTICE BLOCK */}
      <button 
        onClick={() => navigate('/practice')} 
        className="w-full glass bg-gradient-to-br from-primary-600 to-sky-500 p-6 md:p-8 rounded-3xl text-left flex items-center justify-between group overflow-hidden relative shadow-lg shadow-primary-500/20 hover:scale-[1.01] hover:shadow-primary-500/30 transition-all border border-primary-400/50"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm text-white shrink-0 shadow-sm border border-white/20">
            <PlayCircle size={32} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Start Global Practice</h2>
            <p className="text-sm text-primary-100 font-medium">Mix questions from all disciplines across {currentCourse?.name}</p>
          </div>
        </div>
        <div className="hidden sm:flex relative z-10 w-12 h-12 rounded-full bg-white/10 items-center justify-center shrink-0">
           <ChevronRight size={24} className="text-white opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transition-all font-bold"/>
        </div>
      </button>

      {/* 4. DISCIPLINES LIST */}
      <div className="pt-4 px-2">
         <h3 className="text-xl font-lexend font-bold text-slate-800 dark:text-slate-200 mb-6">
           Course Disciplines
         </h3>

         {isLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="h-20 glass rounded-2xl animate-pulse bg-gray-100/50 dark:bg-slate-900/50" />
             ))}
           </div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
             {disciplines?.map((discipline: Discipline) => (
               <div 
                 key={discipline.id}
                 onClick={() => navigate(`/practice?discipline=${discipline.id}`)}
                 className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 p-4 md:p-5 rounded-[1.25rem] flex items-center justify-between group hover:border-primary-500 hover:shadow-md hover:shadow-primary-500/5 cursor-pointer transition-all active:scale-95"
               >
                 <div className="flex items-center gap-4 min-w-0 pr-4">
                   <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-500/10 group-hover:text-primary-600 transition-colors shrink-0">
                     <Layers size={18} />
                   </div>
                   <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate text-base">
                     {discipline.name}
                   </span>
                 </div>
                 <ChevronRight size={18} className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all shrink-0 font-bold" />
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
};

export default DisciplineExplorer;
