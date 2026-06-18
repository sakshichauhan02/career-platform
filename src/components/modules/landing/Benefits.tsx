'use client';

import { motion } from 'framer-motion';
import { Target, ShieldCheck, Zap, BookOpen } from 'lucide-react';

const benefits = [
  {
    name: 'Scientific & Objective',
    description:
      'We don’t rely on gut feelings. Our psychometric interest mappings match inputs against standard career matrices to deliver unbiased recommendations.',
    icon: Target,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    name: 'Validated by Human Experts',
    description:
      'AI sets the baseline, but experienced mentors review your plans, answer specific questions, and validate stream choices for complete confidence.',
    icon: ShieldCheck,
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  },
  {
    name: 'Actionable Career Roadmaps',
    description:
      'Get deep breakdowns of your careers, including required subjects, recommended entrance exams, average packages, and year-by-year targets.',
    icon: Zap,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
  {
    name: 'Curated College Matches',
    description:
      'Filter through a rich database of 10,000+ top Indian and global colleges based on fees, admission score criteria, and placements.',
    icon: BookOpen,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export function Benefits() {
  return (
    <section className="relative border-t border-slate-900 bg-slate-950 py-20">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Why Students & Parents Trust PathWayAI
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            We bridge the gap between AI-driven precision data and practical human counseling.
          </p>
        </div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.name}
                variants={itemVariants}
                className="group flex items-start gap-5 rounded-2xl border border-slate-900 bg-slate-900/10 p-8 transition-all duration-300 hover:border-slate-800/80 hover:bg-slate-900/25"
              >
                <div
                  className={`rounded-xl border p-4 ${benefit.color} flex-shrink-0 transition-transform group-hover:scale-105`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-white">{benefit.name}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{benefit.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
