import { useExamStore } from '../../store/examStore';

const ExamNavigator: React.FC = () => {
  const { 
    questions, 
    answers, 
    flags, 
    currentPage, 
    setPage 
  } = useExamStore();

  return (
    <aside className="w-full lg:w-80 bg-white dark:bg-slate-900 border-l border-gray-100 dark:border-slate-800 p-6 flex flex-col gap-8 overflow-y-auto shrink-0 z-20 h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Exam Navigator</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Answered</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Flagged</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2.5">
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            const isFlagged = !!flags[q.id];
            const isCurrentPage = Math.floor(i / 5) === currentPage;

            let statusClass = "bg-slate-50 dark:bg-slate-800 text-slate-400 border-transparent transition-all";
            if (isAnswered) statusClass = "bg-primary-500 text-white shadow-lg shadow-primary-500/20";
            if (isFlagged) statusClass = "bg-amber-500 text-white shadow-lg shadow-amber-500/20";
            if (isCurrentPage) statusClass += " ring-2 ring-primary-500/50 ring-offset-2 dark:ring-offset-slate-900";

            return (
              <button
                key={q.id}
                onClick={() => setPage(Math.floor(i / 5))}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs ${statusClass} active:scale-90`}
                title={`Question ${i + 1}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center">Summary Statistics</h4>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <span className="text-xl font-bold text-slate-800 dark:text-white">{Object.keys(answers).length}</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Answered</p>
          </div>
          <div className="space-y-1">
            <span className="text-xl font-bold text-amber-500">{Object.keys(flags).filter(id => !!flags[id]).length}</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Flagged</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ExamNavigator;
