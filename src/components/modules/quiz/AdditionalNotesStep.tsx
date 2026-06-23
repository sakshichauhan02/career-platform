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
          className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
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
