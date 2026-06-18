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
              className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/35 p-5"
            >
              <div>
                <p className="text-sm font-semibold text-white">{sld.title}</p>
                <p className="mt-0.5 text-xs text-slate-400">{sld.desc}</p>
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
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-indigo-500 transition-all focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${
                      ((value - 1) / 4) * 100
                    }%, #1e293b ${((value - 1) / 4) * 100}%, #1e293b 100%)`,
                  }}
                />

                <div className="flex justify-between text-[10px] font-medium text-slate-400">
                  <span className={value <= 2 ? 'font-bold text-indigo-400' : ''}>
                    {sld.leftLabel}
                  </span>
                  <span className={value === 3 ? 'font-bold text-indigo-400' : ''}>Moderate</span>
                  <span className={value >= 4 ? 'font-bold text-indigo-400' : ''}>
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
