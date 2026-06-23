'use client';

import { motion } from 'framer-motion';
import { Target, ShieldCheck, Zap, BookOpen } from 'lucide-react';

const benefits = [
  {
    name: 'Scientific & Objective',
    description:
      'We don’t rely on gut feelings. Our psychometric interest mappings match inputs against standard career matrices to deliver unbiased recommendations.',
    icon: Target,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    name: 'Validated by Human Experts',
    description:
      'AI sets the baseline, but experienced mentors review your plans, answer specific questions, and validate stream choices for complete confidence.',
    icon: ShieldCheck,
    color: 'text-violet-600 bg-violet-50 border-violet-100',
  },
  {
    name: 'Actionable Career Roadmaps',
    description:
      'Get deep breakdowns of your careers, including required subjects, recommended entrance exams, average packages, and year-by-year targets.',
    icon: Zap,
    color: 'text-rose-600 bg-rose-50 border-rose-100',
  },
  {
    name: 'Curated College Matches',
    description:
      'Filter through a rich database of 10,000+ top Indian and global colleges based on fees, admission score criteria, and placements.',
    icon: BookOpen,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
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
    <section className="border-border relative border-t bg-white py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-blue-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Why Students & Parents Trust PathWayAI
          </h2>
          <p className="mt-4 text-lg font-medium text-slate-500">
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
                className="group border-border flex items-start gap-5 rounded-3xl border bg-slate-50/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div
                  className={`rounded-2xl border p-4 ${benefit.color} flex-shrink-0 transition-transform group-hover:scale-105`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900">{benefit.name}</h3>
                  <p className="text-sm leading-relaxed font-medium text-slate-500">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
