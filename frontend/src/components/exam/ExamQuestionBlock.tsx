import React from 'react';
import { type Question, type QuestionOption } from '../../api/questionService';
import { Flag } from 'lucide-react';

interface ExamQuestionBlockProps {
  question: Question;
  index: number;
  selectedOptionId?: string;
  isFlagged: boolean;
  onSelect: (optionId: string) => void;
  onToggleFlag: () => void;
}

const ExamQuestionBlock: React.FC<ExamQuestionBlockProps> = ({
  question,
  index,
  selectedOptionId,
  isFlagged,
  onSelect,
  onToggleFlag,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      {/* Question Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
            {index}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Question Item</span>
        </div>

        <button 
          onClick={onToggleFlag}
          className={`p-2.5 rounded-xl transition-all ${isFlagged ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-50 text-slate-300 dark:bg-slate-800 dark:text-slate-700 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-500'}`}
        >
          <Flag size={18} fill={isFlagged ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h3 className="text-lg sm:text-xl font-medium text-slate-800 dark:text-white leading-relaxed">
          {question.text}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="grid gap-3 sm:gap-4">
        {question.options.map((option: QuestionOption, idx: number) => {
          const isSelected = selectedOptionId === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`w-full p-4 sm:p-5 text-left rounded-2xl border-2 transition-all flex items-center gap-4 group/option ${
                isSelected 
                  ? 'border-primary-500 bg-primary-50 px-6 dark:bg-primary-500/10 text-primary-900 dark:text-primary-100 font-bold shadow-sm' 
                  : 'border-transparent bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                isSelected 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 group-hover/option:border-primary-500 group-hover/option:text-primary-500'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="flex-1 text-sm sm:text-base leading-tight">
                {option.text}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default ExamQuestionBlock;
