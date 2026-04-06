import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { curriculumService, type Course } from '../api/curriculumService';
import { practiceService } from '../api/practiceService';
import { useExamStore } from '../store/examStore';
import { 
  Search, 
  ChevronRight, 
  Clock, 
  FileText, 
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExamSetup: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startExam = useExamStore((state) => state.startExam);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => curriculumService.getCourses(),
  });

  const filteredCourses = courses?.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartExam = async () => {
    if (!selectedCourse) return;
    setIsStarting(true);
    setError(null);
    console.log('Starting exam for course:', selectedCourse.name);
    try {
      const response = await practiceService.startSession({
        session_type: 'EXAM',
        course_id: selectedCourse.id,
        count: 120 // Standardized 120 questions
      });
      console.log('Session started successfully:', response.session.id);
      
      if (!response.questions || response.questions.length === 0) {
        throw new Error('No questions were returned for this course.');
      }

      startExam(response.session, response.questions);
      console.log('Navigating to /exam-session...');
      navigate('/exam-session');
    } catch (err: any) {
      console.error('Failed to start exam:', err);
      setError(err.message || 'Failed to start exam. Please try again.');
      setIsStarting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-lexend font-bold text-slate-900 dark:text-white">
          Exam Mode
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          Enter a standardized, timed mock assessment environment. Select your course to begin the evaluation.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Course Selection Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-600">
              <Search size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Select Course</h2>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or code (e.g. Anatomy)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-5 py-4 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredCourses?.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                No courses found matching "{searchQuery}"
              </div>
            ) : (
              filteredCourses?.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all group flex items-center justify-between ${
                    selectedCourse?.id === course.id 
                      ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-500/5' 
                      : 'border-transparent bg-slate-50 dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{course.code}</span>
                    <span className="font-bold text-slate-800 dark:text-white group-hover:text-primary-600 transition-colors">{course.name}</span>
                  </div>
                  {selectedCourse?.id === course.id && <CheckCircle2 className="text-primary-600 shrink-0" size={20} />}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Exam Details Card */}
        <AnimatePresence mode="wait">
          {selectedCourse ? (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold font-lexend">Exam Structure</h2>
                  <span className="px-3 py-1 bg-primary-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Official Mock</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <FileText size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Questions</span>
                    </div>
                    <p className="text-2xl font-bold">120 MCQs</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Time Limit</span>
                    </div>
                    <p className="text-2xl font-bold">180 Mins</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Layers size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Content</span>
                    </div>
                    <p className="text-xl font-bold text-primary-400">Mixed Disciplines</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <AlertCircle size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Feedback</span>
                    </div>
                    <p className="text-lg font-bold">Post-Exam Only</p>
                  </div>
                </div>

                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                  <h4 className="flex items-center gap-2 font-bold text-primary-400">
                    <HelpCircle size={18} /> Instructions
                  </h4>
                  <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                    <li>Exam interface is full-screen immersive.</li>
                    <li>Answers save automatically on selection.</li>
                    <li>Review mode is available after submission.</li>
                  </ul>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/50 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-medium animate-shake">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <button
                onClick={handleStartExam}
                disabled={isStarting}
                className="w-full mt-10 py-5 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-lg shadow-primary-600/30"
              >
                {isStarting ? 'Preparing Session...' : (
                  <>
                    Start {selectedCourse.name} Mock <ChevronRight size={20} />
                  </>
                )}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-100 dark:bg-slate-800/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center space-y-4"
            >
              <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg text-slate-300">
                <FileText size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Select a course to view its standardized exam structure</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExamSetup;
