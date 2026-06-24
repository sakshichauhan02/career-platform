'use client';

import { motion } from 'framer-motion';
import { IndianRupee, Landmark, Coins, GraduationCap, Plane, type LucideIcon } from 'lucide-react';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { QuestionCard } from '@/components/ui/question-card';

interface BudgetOption {
  id: string;
  label: string;
  desc: string;
  feeText: string;
  icon: LucideIcon;
}

const budgetOptions: BudgetOption[] = [
  {
    id: 'under_1l',
    label: 'Affordable / Government Tiers',
    desc: 'Focus on public universities, state colleges, and scholarship schemes.',
    feeText: '< ₹1 Lakh / Year',
    icon: Coins,
  },
  {
    id: '1l_3l',
    label: 'Standard Moderate',
    desc: 'Targeting standard private universities and public technical institutes.',
    feeText: '₹1 Lakh - ₹3 Lakhs / Year',
    icon: IndianRupee,
  },
  {
    id: '3l_5l',
    label: 'Premium Private',
    desc: 'Top-tier private engineering, law, business schools, or technical academies.',
    feeText: '₹3 Lakhs - ₹5 Lakhs / Year',
    icon: Landmark,
  },
  {
    id: '5l_10l',
    label: 'Elite Domestic / Medical Tracks',
    desc: 'Elite design universities, top management tracks, or domestic medical fees.',
    feeText: '₹5 Lakhs - ₹10 Lakhs / Year',
    icon: GraduationCap,
  },
  {
    id: 'above_10l',
    label: 'Global Study / Elite Universities',
    desc: 'Targeting top global business schools, international studies, or MBBS paths.',
    feeText: '₹10+ Lakhs / Year',
    icon: Plane,
  },
];

interface BudgetStepProps {
  onSelect?: () => void;
}

export default function BudgetStep({ onSelect }: BudgetStepProps) {
  const { data, updateStepData } = useAssessmentStore();

  return (
    <QuestionCard
      title="What is your annual study budget?"
      description="This helps us recommend colleges and courses matching your financial range."
    >
      <div className="space-y-3">
        {budgetOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = data.budget === opt.id;

          return (
            <motion.button
              key={opt.id}
              type="button"
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                updateStepData({ budget: opt.id });
                if (onSelect) {
                  setTimeout(onSelect, 250);
                }
              }}
              className={`focus:ring-primary flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 focus:ring-1 focus:outline-none ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-500/5'
                  : 'border-slate-200 bg-white hover:border-blue-500/20 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-lg p-2.5 transition-colors duration-200 ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm leading-snug font-semibold text-slate-900">{opt.label}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{opt.desc}</p>
                </div>
              </div>

              <div className="pl-3 text-right">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    isSelected ? 'text-blue-750 bg-blue-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {opt.feeText}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </QuestionCard>
  );
}
