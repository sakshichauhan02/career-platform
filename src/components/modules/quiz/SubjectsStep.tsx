'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search } from 'lucide-react';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { QuestionCard } from '@/components/ui/question-card';

const streamSubjects: Record<string, string[]> = {
  pcm: [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Computer Science',
    'English',
    'Informatics Practices',
  ],
  pcb: ['Biology', 'Physics', 'Chemistry', 'English', 'Biotechnology', 'Psychology', 'EVS'],
  commerce: [
    'Accountancy',
    'Business Studies',
    'Economics',
    'Mathematics',
    'English',
    'Entrepreneurship',
  ],
  arts: [
    'History',
    'Political Science',
    'Sociology',
    'Geography',
    'Psychology',
    'English',
    'Fine Arts',
  ],
  general: [
    'Mathematics',
    'Science',
    'Social Studies',
    'English',
    'Information Technology',
    'Art & Design',
  ],
  undecided: [
    'Mathematics',
    'Science',
    'Social Studies',
    'English',
    'Computers',
    'Creative Writing',
  ],
};

export default function SubjectsStep() {
  const { data, updateStepData } = useAssessmentStore();
  const [search, setSearch] = useState('');
  const [customSubject, setCustomSubject] = useState('');

  const activeStream = data.stream || 'general';
  const defaultSubjects = streamSubjects[activeStream] || streamSubjects.general;

  const toggleSubject = (subject: string) => {
    const current = [...data.subjects];
    const index = current.indexOf(subject);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(subject);
    }
    updateStepData({ subjects: current });
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSubject.trim();
    if (clean && !data.subjects.includes(clean)) {
      updateStepData({ subjects: [...data.subjects, clean] });
      setCustomSubject('');
    }
  };

  const filteredDefaults = defaultSubjects.filter(
    (subj) => subj.toLowerCase().includes(search.toLowerCase()) && !data.subjects.includes(subj)
  );

  return (
    <QuestionCard
      title="Favorite or strong subjects"
      description="Select subjects you score well in or enjoy learning the most."
    >
      <div className="space-y-6">
        {/* Selected Items Row */}
        <div className="min-h-12 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 p-3">
          {data.subjects.length === 0 ? (
            <p className="py-2 text-center text-xs text-slate-500">
              No subjects selected yet. Click options below or add your own.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {data.subjects.map((subj) => (
                  <motion.span
                    key={subj}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/50 bg-indigo-500/25 px-3 py-1 text-xs font-medium text-indigo-300"
                  >
                    {subj}
                    <button
                      type="button"
                      onClick={() => toggleSubject(subj)}
                      className="rounded-full p-0.5 hover:bg-indigo-500/50 hover:text-white focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Search & Custom Input */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/40 py-2.5 pr-4 pl-9 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <form onSubmit={handleAddCustom} className="flex gap-2">
            <input
              type="text"
              placeholder="Add other subject..."
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-white transition-colors hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Recommended subjects based on selected stream */}
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Recommended for your Stream
          </p>
          <div className="flex flex-wrap gap-2">
            {filteredDefaults.length === 0 && search !== '' ? (
              <p className="py-1 text-xs text-slate-400">
                No matches in recommended list. You can add it using the input field above.
              </p>
            ) : (
              filteredDefaults.map((subj) => (
                <motion.button
                  key={subj}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleSubject(subj)}
                  className="rounded-lg border border-slate-800 bg-slate-900/30 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:bg-slate-900/70 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  {subj}
                </motion.button>
              ))
            )}
          </div>
        </div>
      </div>
    </QuestionCard>
  );
}
