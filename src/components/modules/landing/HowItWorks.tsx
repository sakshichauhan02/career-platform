'use client';

import { motion } from 'framer-motion';
import { ClipboardList, Cpu, Landmark, FileText } from 'lucide-react';

const steps = [
  {
    step: '01',
    name: 'Answer Questions',
    description: 'Spend 5 minutes answering simple interest and behavior-based questions.',
    icon: ClipboardList,
    color: 'from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
  {
    step: '02',
    name: 'Get Recommendations',
    description: 'Unlock customized stream, course, and career recommendations instantly.',
    icon: Cpu,
    color: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-400',
  },
  {
    step: '03',
    name: 'Explore Colleges',
    description: 'Browse details of top colleges matched specifically to your career roadmap.',
    icon: Landmark,
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-rose-400',
  },
  {
    step: '04',
    name: 'Download Career Report',
    description:
      'Download a highly detailed, print-ready PDF Career Report for you and your parents.',
    icon: FileText,
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HowItWorks() {
  return (
    <section className="relative border-t border-slate-900 bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Your Journey to a Clear Career Path
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            A simple, step-by-step roadmap to eliminate career uncertainty and discover your
            strengths.
          </p>
        </div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                variants={cardVariants}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/20 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-800"
              >
                <div>
                  {/* Step Badge */}
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-slate-650 border-slate-850 rounded-full border bg-slate-900 px-3 py-1 font-mono text-xs font-bold">
                      STEP {item.step}
                    </span>
                    <div
                      className={`rounded-xl bg-gradient-to-r p-3 ${item.color} ${item.iconColor} transition-transform group-hover:scale-110`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="mb-3 text-lg font-bold text-white">{item.name}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{item.description}</p>
                </div>

                {/* Connecting Line (for desktop) */}
                {idx < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-4 z-10 hidden w-8 border-t border-dashed border-slate-800 lg:block" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
