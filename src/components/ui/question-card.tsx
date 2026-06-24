'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

const counselorPrompts: Record<string, string> = {
  'What is your current education level?':
    "Hi! I'm Aria, your career guide. Let's start our journey by understanding where you currently are. What is your current education level?",
  'Choose your stream':
    'Got it! Depending on your path, your academic stream opens up different avenues. Which stream are you currently in or planning to choose?',
  'Favorite or strong subjects':
    'Subjects you enjoy often highlight your natural strengths. Select the subjects you score well in or enjoy learning the most!',
  'What fields interest you?':
    "Let's explore your curiosities. What general fields or topics make you lose track of time? Select any that interest you.",
  'What are your hobbies?':
    'Outside the classroom, what activities keep you energized? Hobbies often reflect key cognitive strengths and work inclinations.',
  'What is your working style?':
    'Different careers thrive in different styles. How do you see yourself working? Adjust these sliders to describe your comfort zone.',
  'Rank your career priorities':
    'What is your main driver in a career? Rank these priorities in order of importance to you (1st choice, 2nd choice, etc.).',
  'What is your annual study budget?':
    'To recommend realistic colleges, it helps to understand your financial plan. What annual budget range should we target for tuition?',
  'Any additional notes or goals?':
    "We're almost done! Is there anything else you'd like me to know? For example, target colleges, dream roles, or special scholarship needs.",
};

export function QuestionCard({ title, description, children, className }: QuestionCardProps) {
  const promptText = counselorPrompts[title] || title;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className={cn('space-y-6', className)}
    >
      {/* Conversational Counselor Bubble */}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
        {/* Avatar container */}
        <div className="relative flex items-center gap-3 sm:block sm:shrink-0">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-blue-200 bg-blue-50 p-0.5 shadow-sm">
            <span className="text-xl" role="img" aria-label="advisor">
              👩‍💼
            </span>
            <span className="absolute -right-0.5 -bottom-0.5 block h-3 w-3 rounded-full border border-white bg-emerald-500" />
          </div>
          <div className="sm:hidden">
            <span className="block text-xs font-bold text-slate-900">Aria</span>
            <span className="block text-[10px] font-medium text-slate-500">Career Advisor</span>
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="relative w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 shadow-sm sm:flex-1">
          {/* Pointer tail (only visible on sm screen and up) */}
          <div className="absolute top-5 -left-1.5 hidden h-3 w-3 rotate-45 border-b border-l border-slate-200 bg-slate-50/50 sm:block" />
          <span className="text-blue-650 mb-1 hidden text-[10px] font-bold tracking-wider uppercase sm:block">
            Aria (AI Guide)
          </span>
          <p className="text-sm leading-relaxed font-semibold text-slate-800 md:text-base">
            {promptText}
          </p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
    </motion.div>
  );
}
