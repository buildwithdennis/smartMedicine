import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Filter, Bookmark } from 'lucide-react';
import { curriculumService, type Course, type Level } from '../api/curriculumService';

// Fallback short descriptions mapped securely
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

const CourseExplorer: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLevelId, setSelectedLevelId] = useState<string>('all');

  const { data: levels, isLoading: levelsLoading } = useQuery({
    queryKey: ['levels'],
    queryFn: () => curriculumService.getLevels(),
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', selectedLevelId === 'all' ? undefined : selectedLevelId],
    queryFn: () => curriculumService.getCourses(selectedLevelId === 'all' ? undefined : selectedLevelId),
  });

  const isLoading = levelsLoading || coursesLoading;

  // Group courses by level logic
  const getLevelName = (levelId: string) => {
    return levels?.find((l: Level) => l.id === levelId)?.name || 'Unknown Level';
  };

  const groupedCourses = courses?.reduce((acc: Record<string, Course[]>, course: Course) => {
    if (!acc[course.level]) acc[course.level] = [];
    acc[course.level].push(course);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* 1. HERO PAGE HEADER */}
      <div className="glass p-8 md:p-10 rounded-3xl relative overflow-hidden flex flex-col justify-center border border-gray-100/50 dark:border-slate-800/50 shadow-sm bg-gradient-to-r from-white to-gray-50/50 dark:from-slate-900/80 dark:to-slate-900/40">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-lexend font-bold tracking-tight text-slate-800 dark:text-white mb-3">
            Your Medical Courses
          </h1>
          <p className="text-base text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
            Explore your courses by level and continue your revision journey with focused practice.
          </p>
        </div>
      </div>

      {/* 2. FILTER / CONTROL BAR */}
      <div className="flex justify-between items-center bg-transparent border-none p-0 mt-4 h-14">
         <div className="font-lexend font-bold text-lg text-slate-800 dark:text-slate-200">
            Course Curriculum
         </div>
         <div className="relative w-full md:w-64 group bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:border-primary-500/50 transition-colors shadow-sm">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 w-4 h-4 pointer-events-none" />
          <select 
            value={selectedLevelId}
            onChange={(e) => setSelectedLevelId(e.target.value)}
            className="w-full appearance-none bg-transparent py-3 pl-12 pr-10 outline-none font-medium text-sm text-slate-800 dark:text-slate-200 cursor-pointer"
          >
            <option value="all">Display All Levels</option>
            {levels?.map((level: Level) => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 transform rotate-90 pointer-events-none" />
        </div>
      </div>

      {/* 3. GROUPED COURSE GRID */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 glass rounded-[1.5rem] animate-pulse bg-gray-100/50 dark:bg-slate-900/50" />
          ))}
        </div>
      ) : Object.keys(groupedCourses || {}).length === 0 ? (
        <div className="glass p-12 rounded-3xl text-center max-w-2xl mx-auto flex flex-col items-center border border-gray-100 dark:border-slate-800 shadow-sm mt-8">
          <h3 className="text-xl font-lexend font-bold text-slate-800 dark:text-slate-200 mb-2">No courses found</h3>
          <p className="text-gray-500 dark:text-slate-400 font-medium">Try adjusting your level filter.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedCourses || {}).map(([levelId, levelCourses]) => (
            <div key={levelId} className="animate-fade-in relative">
               <div className="flex items-center gap-3 mb-6">
                 <div className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-widest rounded-lg border border-gray-200 dark:border-slate-700">
                   {getLevelName(levelId)}
                 </div>
                 <div className="h-px bg-gray-200 dark:bg-slate-800 flex-1" />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                 {levelCourses.map((course: Course) => (
                   <div 
                     key={course.id}
                     onClick={() => navigate(`/courses/${course.id}`)}
                     className="group bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800/80 rounded-2xl p-5 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/5 transition-all flex items-center justify-between cursor-pointer"
                   >
                     <div className="flex items-center gap-5 overflow-hidden">
                       <div className="w-14 h-14 rounded-[1rem] bg-gray-50 dark:bg-slate-900 text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-primary-500/10 group-hover:text-primary-600 flex items-center justify-center shrink-0 transition-colors border border-gray-100 dark:border-slate-800">
                         <Bookmark size={24} />
                       </div>
                       <div className="min-w-0 pr-4">
                         <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                           {course.name}
                         </h3>
                         <p className="text-xs text-gray-500 dark:text-slate-500 font-medium truncate mt-0.5">
                           {getCourseDescription(course.name)}
                         </p>
                       </div>
                     </div>
                     <div className="w-10 h-10 rounded-full border border-gray-100 dark:border-slate-800 flex items-center justify-center shrink-0 text-gray-300 dark:text-gray-600 group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white transition-all shadow-sm">
                       <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseExplorer;
