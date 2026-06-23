'use client';

import { useAssessmentStore } from '@/store/useAssessmentStore';
import { QuestionCard } from '@/components/ui/question-card';

interface SliderInfo {
  key: 'collaboration' | 'workplace' | 'structure';
  title: string;
  desc: string;
  leftLabel: string;
  rightLabel: string;
}

const sliders: SliderInfo[] = [
  {
    key: 'collaboration',
    title: 'Work Collaboration Style',
    desc: 'Do you prefer solving problems alone or working in cross-functional squads?',
    leftLabel: 'Independent (Solo Focus)',
    rightLabel: 'Collaborative (Team Focus)',
  },
  {
    key: 'workplace',
    title: 'Preferred Work Environment',
    desc: 'Do you prefer working from a dedicated desk or being on the move outdoors?',
    leftLabel: 'Desk / Lab (Indoor)',
    rightLabel: 'Field / Travel (Outdoor)',
  },
  {
    key: 'structure',
    title: 'Task Structure & Rules',
    desc: 'Do you work best with structured instructions or open-ended creative tasks?',
    leftLabel: 'Structured (Clear Guidelines)',
    rightLabel: 'Dynamic (Flexible/Creative)',
  },
];

export default function WorkStyleStep() {
  const { data, updateStepData } = useAssessmentStore();

  const handleSliderChange = (key: 'collaboration' | 'workplace' | 'structure', val: number) => {
    updateStepData({
      workStyle: {
        ...data.workStyle,
        [key]: val,
      },
    });
  };

  return (
    <QuestionCard
      title="What is your working style?"
      description="Move the sliders to describe the environments you feel most comfortable in."
    >
      <div className="space-y-8">
        {sliders.map((sld) => {
          const value = data.workStyle[sld.key] || 3;

          return (
            <div
              key={sld.key}
              className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-5"
            >
              <div>
                <p className="text-sm font-bold text-slate-900">{sld.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{sld.desc}</p>
              </div>

              {/* Slider Input with markers */}
              <div className="space-y-2 pt-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={value}
                  onChange={(e) => handleSliderChange(sld.key, parseInt(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 transition-all focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #1e40af 0%, #1e40af ${
                      ((value - 1) / 4) * 100
                    }%, #e2e8f0 ${((value - 1) / 4) * 100}%, #e2e8f0 100%)`,
                  }}
                />

                <div className="flex justify-between text-[10px] font-medium text-slate-500">
                  <span className={value <= 2 ? 'font-extrabold text-blue-600' : ''}>
                    {sld.leftLabel}
                  </span>
                  <span className={value === 3 ? 'font-extrabold text-blue-600' : ''}>Moderate</span>
                  <span className={value >= 4 ? 'font-extrabold text-blue-600' : ''}>
                    {sld.rightLabel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </QuestionCard>
  );
}
