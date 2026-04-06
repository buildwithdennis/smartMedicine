import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ChevronLeft, 
  Save, 
  Plus, 
  Trash2, 
  Layers, 
  BookOpen, 
  Target, 
  Settings 
} from 'lucide-react';
import api from '../api/axios';
import { type Level, type Course, type Discipline, curriculumService } from '../api/curriculumService';
import { type Question, questionService } from '../api/questionService';

const questionSchema = z.object({
  text: z.string().min(10, 'Question text must be at least 10 characters'),
  explanation: z.string().min(10, 'Explanation must be at least 10 characters'),
  level: z.string().uuid('Level is required'),
  course: z.string().uuid('Course is required'),
  discipline: z.string().uuid('Discipline is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  question_type: z.enum(['SBA', 'MCQ']),
  status: z.enum(['draft', 'published', 'archived']),
  source_year: z.number().optional(),
  options: z.array(z.object({
    text: z.string().min(1, 'Option text is required'),
    is_correct: z.boolean(),
    order: z.number()
  })).min(2, 'At least 2 options are required')
});

const AdminQuestionEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: levels } = useQuery<Level[]>({ queryKey: ['levels'], queryFn: curriculumService.getLevels });
  const { data: courses } = useQuery<Course[]>({ queryKey: ['courses'], queryFn: () => curriculumService.getCourses() });
  const { data: disciplines } = useQuery<Discipline[]>({ queryKey: ['disciplines'], queryFn: () => curriculumService.getDisciplines() });

  const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: '',
      explanation: '',
      level: '',
      course: '',
      discipline: '',
      difficulty: 'medium' as const,
      question_type: 'SBA' as const,
      status: 'draft' as const,
      options: [
        { text: '', is_correct: true, order: 0 },
        { text: '', is_correct: false, order: 1 },
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options"
  });

  // Fetch existing question for edit
  const { data: questionData } = useQuery<Question>({
    queryKey: ['admin-question', id],
    queryFn: () => questionService.getQuestionDetail(id!),
    enabled: isEdit,
  });

  React.useEffect(() => {
    if (questionData) {
      Object.keys(questionData).forEach((key: any) => {
        if (key !== 'options' && key in questionSchema.shape) {
          setValue(key as any, (questionData as any)[key]);
        }
      });
      // Handle options separately
      if (questionData.options) {
        setValue('options', questionData.options.map(opt => ({
          text: opt.text,
          is_correct: opt.is_correct,
          order: opt.order
        })));
      }
    }
  }, [questionData, setValue, isEdit]);

  const selectedLevel = watch('level');
  const selectedCourse = watch('course');

  const filteredCourses = React.useMemo(() => {
    if (!selectedLevel || !courses) return [];
    return courses.filter(c => c.level === selectedLevel);
  }, [selectedLevel, courses]);

  const filteredDisciplines = React.useMemo(() => {
    if (!selectedCourse || !disciplines) return [];
    return disciplines.filter(d => d.course === selectedCourse);
  }, [selectedCourse, disciplines]);

  const mutation = useMutation({
    mutationFn: (data: any) => isEdit ? api.put(`/questions/${id}/`, data) : api.post('/questions/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-questions'] });
      navigate('/admin/questions');
    }
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/questions')}
          className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-slate-500 hover:text-rose-600 transition-all hover:scale-105"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-lexend font-bold tracking-tight">{isEdit ? 'Edit Tactical Question' : 'Deploy New Question'}</h2>
          <p className="text-slate-500 font-medium tracking-tight mt-1">Technical configuration and validation of academic content.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-10 rounded-[3rem] space-y-6 shadow-sm border border-white/40 dark:border-slate-800">
            <h3 className="font-lexend font-bold text-lg flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-primary-600/10 text-primary-600 flex items-center justify-center"><BookOpen size={18} /></span>
              Question Payload
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Question Content</label>
              <textarea 
                {...register('text')}
                rows={4}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/10 rounded-3xl p-6 outline-none transition-all font-medium text-lg leading-relaxed shadow-inner"
                placeholder="Describe the medical case or question scenario..."
              />
              {errors.text && <p className="text-rose-500 text-xs font-bold mt-1 ml-4 tracking-tight">{errors.text.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Academic Explanation</label>
              <textarea 
                {...register('explanation')}
                rows={3}
                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-sky-500/20 focus:ring-4 focus:ring-sky-500/10 rounded-3xl p-6 outline-none transition-all font-medium shadow-inner"
                placeholder="Explain the logic behind the correct answer..."
              />
              {errors.explanation && <p className="text-rose-500 text-xs font-bold mt-1 ml-4 tracking-tight">{errors.explanation.message}</p>}
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] space-y-6 shadow-sm border border-white/40 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-lexend font-bold text-lg flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center"><Target size={18} /></span>
                Response Matrix
              </h3>
              <button 
                type="button" 
                onClick={() => append({ text: '', is_correct: false, order: fields.length })}
                className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Plus size={14} /> Add Vector
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-center group">
                  <div className="flex-1 relative">
                    <input 
                      {...register(`options.${index}.text` as const)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-5 px-6 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium"
                      placeholder={`Option Vector ${index + 1}`}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer group/label">
                        <input 
                          type="checkbox" 
                          {...register(`options.${index}.is_correct` as const)}
                          className="w-6 h-6 rounded-lg border-2 border-slate-200 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer transition-all"
                        />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-emerald-500 group-hover/label:text-slate-600 transition-colors">Correct</span>
                      </label>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="p-3 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>
            {errors.options && <p className="text-rose-500 text-xs font-bold mt-4 ml-4 tracking-tight">{errors.options.message}</p>}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass p-10 rounded-[3rem] space-y-6 shadow-sm border border-white/40 dark:border-slate-800">
            <h3 className="font-lexend font-bold text-lg flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-amber-600/10 text-amber-600 flex items-center justify-center"><Layers size={18} /></span>
              Metadata Vector
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Academic Level</label>
                <select 
                  {...register('level')}
                  onChange={(e) => {
                    register('level').onChange(e);
                    setValue('course', '');
                    setValue('discipline', '');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-4.5 px-5 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select Level...</option>
                  {levels?.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Course Sync</label>
                <select 
                  {...register('course')}
                  disabled={!selectedLevel}
                  onChange={(e) => {
                    register('course').onChange(e);
                    setValue('discipline', '');
                  }}
                  className={`w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-4.5 px-5 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none appearance-none cursor-pointer transition-opacity ${!selectedLevel ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select Course...</option>
                  {filteredCourses?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Discipline Vector</label>
                <select 
                  {...register('discipline')}
                  disabled={!selectedCourse}
                  className={`w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl py-4.5 px-5 text-sm font-bold focus:ring-2 focus:ring-amber-500/20 outline-none appearance-none cursor-pointer transition-opacity ${!selectedCourse ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select Discipline...</option>
                  {filteredDisciplines?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem] space-y-6">
            <h3 className="font-lexend font-bold text-lg flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center"><Settings size={18} /></span>
              Control
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map(tier => (
                  <button 
                    key={tier}
                    type="button"
                    onClick={() => setValue('difficulty', tier as any)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      watch('difficulty') === tier 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                        : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              <select 
                {...register('status')}
                className={`w-full border-none rounded-xl py-4 px-5 text-sm font-bold focus:ring-2 outline-none appearance-none ${
                  watch('status') === 'published' ? 'bg-emerald-600/10 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <option value="draft">DRAFT MODE</option>
                <option value="published">DEPLOY TO BANK</option>
                <option value="archived">ARCHIVED</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-5 bg-rose-600 text-white rounded-[1.5rem] font-lexend font-bold text-lg shadow-2xl shadow-rose-600/30 hover:bg-rose-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <Save size={22} />
              {isEdit ? 'Update Baseline' : 'Initiate Deployment'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminQuestionEditor;
