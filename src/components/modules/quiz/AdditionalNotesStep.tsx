'use client';

import { useAssessmentStore } from '@/store/useAssessmentStore';
import { QuestionCard } from '@/components/ui/question-card';

export default function AdditionalNotesStep() {
  const { data, updateStepData } = useAssessmentStore();
  const value = data.additionalNotes || '';
  const charLimit = 500;

  const handleChange = (val: string) => {
    if (val.length <= charLimit) {
      updateStepData({ additionalNotes: val });
    }
  };

  return (
    <QuestionCard
      title="Any additional notes or goals?"
      description="Share your target colleges, dream roles, or any specific requirements. (Optional)"
    >
      <div className="space-y-2">
        <textarea
          rows={6}
          placeholder="I want to build a career in AI and study at IITs, or explore international colleges offering scholarships..."
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full resize-none rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-white placeholder-slate-500 transition-all duration-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
        />

        <div className="flex justify-between text-xs text-slate-500">
          <span>Be as detailed as you like</span>
          <span className={value.length >= charLimit - 20 ? 'font-bold text-amber-500' : ''}>
            {value.length} / {charLimit} characters
          </span>
        </div>
      </div>
    </QuestionCard>
  );
}
