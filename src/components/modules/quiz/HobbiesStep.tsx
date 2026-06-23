'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Sparkles } from 'lucide-react';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { QuestionCard } from '@/components/ui/question-card';

const defaultHobbies = [
  'Video Gaming',
  'Creative Writing / Blogging',
  'Painting / Sketching / Sculpting',
  'Playing Sports / Fitness',
  'Playing Musical Instruments',
  'Coding / Side Projects',
  'Reading / Podcasts',
  'Photography / Videography',
  'Debating / Public Speaking',
  'Tinkering with gadgets',
  'Solving Puzzles / Chess',
  'Gardening / Cooking',
];

export default function HobbiesStep() {
  const { data, updateStepData } = useAssessmentStore();
  const [customHobby, setCustomHobby] = useState('');

  const toggleHobby = (hobby: string) => {
    const current = [...data.hobbies];
    const index = current.indexOf(hobby);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(hobby);
    }
    updateStepData({ hobbies: current });
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customHobby.trim();
    if (clean && !data.hobbies.includes(clean)) {
      updateStepData({ hobbies: [...data.hobbies, clean] });
      setCustomHobby('');
    }
  };

  return (
    <QuestionCard
      title="What are your hobbies?"
      description="Your outside-classroom activities reflect key cognitive skills and inclinations."
    >
      <div className="space-y-6">
        {/* Selected Items Row */}
        <div className="min-h-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3">
          {data.hobbies.length === 0 ? (
            <p className="py-2 text-center text-xs text-slate-400">
              No hobbies selected yet. Click options below or add custom ones.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {data.hobbies.map((hobby) => (
                  <motion.span
                    key={hobby}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 shadow-sm"
                  >
                    {hobby}
                    <button
                      type="button"
                      onClick={() => toggleHobby(hobby)}
                      className="rounded-full p-0.5 hover:bg-blue-100 hover:text-blue-750 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Recommended Grid list */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {defaultHobbies.map((hobby) => {
            const isSelected = data.hobbies.includes(hobby);
            return (
              <motion.button
                key={hobby}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleHobby(hobby)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 focus:ring-1 focus:ring-primary focus:outline-none ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-blue-500/20 hover:bg-slate-50/50'
                }`}
              >
                {hobby}
              </motion.button>
            );
          })}
        </div>

        {/* Add Custom Hobby Form */}
        <form onSubmit={handleAddCustom} className="flex justify-center gap-2">
          <div className="relative w-full max-w-xs">
            <Sparkles className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Type other hobby..."
              value={customHobby}
              onChange={(e) => setCustomHobby(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-4 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90 focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </form>
      </div>
    </QuestionCard>
  );
}
