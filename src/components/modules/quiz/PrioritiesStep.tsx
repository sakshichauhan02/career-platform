'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Award,
  Flame,
  HeartPulse,
  RefreshCw,
  Milestone,
  Globe,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { QuestionCard } from '@/components/ui/question-card';

interface PriorityItem {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
}

const prioritiesList: PriorityItem[] = [
  {
    id: 'high_salary',
    label: 'High Earning Potential',
    desc: 'Rapid salary growth, bonuses, financial wealth and rewards',
    icon: Flame,
  },
  {
    id: 'work_life_balance',
    label: 'Work-Life Balance',
    desc: 'Flexible hours, limited stress, time for family/hobbies',
    icon: HeartPulse,
  },
  {
    id: 'stability_security',
    label: 'Job Stability & Security',
    desc: 'Protected roles, government tracks, low risk of layoff',
    icon: ShieldCheck,
  },
  {
    id: 'creative_freedom',
    label: 'Creative Freedom & Innovation',
    desc: 'Freedom to experiment, invent things, control projects',
    icon: Milestone,
  },
  {
    id: 'prestige_status',
    label: 'Prestige & High Status',
    desc: 'Respected social designations, leading public roles',
    icon: Award,
  },
  {
    id: 'social_impact',
    label: 'Social Contribution & Impact',
    desc: 'Directly helping people, teaching, medical care, charity',
    icon: RefreshCw,
  },
  {
    id: 'global_mobility',
    label: 'Global Opportunities',
    desc: 'Opportunities to move, work, or study abroad',
    icon: Globe,
  },
];

export default function PrioritiesStep() {
  const { data, updateStepData } = useAssessmentStore();

  const handleToggle = (id: string) => {
    const current = [...data.priorities];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }
    updateStepData({ priorities: current });
  };

  const getRank = (id: string) => {
    const index = data.priorities.indexOf(id);
    return index > -1 ? index + 1 : null;
  };

  return (
    <QuestionCard
      title="Rank your career priorities"
      description="Click on options below in order of importance to you (1st choice, 2nd choice, etc.)"
    >
      <div className="space-y-6">
        {/* Selected Ranking display */}
        <div className="min-h-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4">
          {data.priorities.length === 0 ? (
            <p className="py-1 text-center text-xs text-slate-400">
              Click priorities below to build your ranking list.
            </p>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="mr-1 text-xs font-semibold text-slate-500">Rankings:</span>
              {data.priorities.map((pId, idx) => {
                const item = prioritiesList.find((i) => i.id === pId);
                return (
                  <div
                    key={pId}
                    className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {idx + 1}
                    </span>
                    <span>{item?.label}</span>
                    <button
                      type="button"
                      onClick={() => handleToggle(pId)}
                      className="rounded-full p-0.5 hover:bg-blue-100 hover:text-blue-900 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {prioritiesList.map((item) => {
            const rank = getRank(item.id);
            const isSelected = rank !== null;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleToggle(item.id)}
                className={`focus:ring-primary flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 focus:ring-1 focus:outline-none ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/5'
                    : 'border-slate-200 bg-white hover:border-blue-500/20 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg p-2.5 transition-colors duration-200 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm leading-snug font-semibold text-slate-900">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-tight text-slate-500">{item.desc}</p>
                  </div>
                </div>

                {isSelected ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-extrabold text-white">
                    {rank}
                  </div>
                ) : (
                  <div className="hover:border-slate-350 h-6 w-6 rounded-full border border-slate-200" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </QuestionCard>
  );
}
