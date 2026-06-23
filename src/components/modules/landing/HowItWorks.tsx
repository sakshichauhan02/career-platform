'use client';

import { motion } from 'framer-motion';
import { ClipboardList, Cpu, Landmark, FileText } from 'lucide-react';

const steps = [
  {
    step: '01',
    name: 'Answer Questions',
    description: 'Spend 5 minutes answering simple interest and behavior-based questions.',
    icon: ClipboardList,
    color: 'from-blue-500/10 to-indigo-500/10',
    iconColor: 'text-blue-600',
  },
  {
    step: '02',
    name: 'Get Recommendations',
    description: 'Unlock customized stream, course, and career recommendations instantly.',
    icon: Cpu,
    color: 'from-violet-500/10 to-purple-500/10',
    iconColor: 'text-violet-600',
  },
  {
    step: '03',
    name: 'Explore Colleges',
    description: 'Browse details of top colleges matched specifically to your career roadmap.',
    icon: Landmark,
    color: 'from-pink-500/10 to-rose-500/10',
    iconColor: 'text-rose-600',
  },
  {
    step: '04',
    name: 'Download Career Report',
    description:
      'Download a highly detailed, print-ready PDF Career Report for you and your parents.',
    icon: FileText,
    color: 'from-emerald-500/10 to-teal-500/10',
    iconColor: 'text-emerald-600',
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
    <section className="border-border relative border-t bg-slate-50/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your Journey to a Clear Career Path
          </h2>
          <p className="mt-4 text-lg font-medium text-slate-500">
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
                className="group border-border relative flex flex-col justify-between rounded-3xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div>
                  {/* Step Badge */}
                  <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 font-mono text-xs font-bold text-blue-600">
                      STEP {item.step}
                    </span>
                    <div
                      className={`rounded-2xl bg-gradient-to-r p-3 ${item.color} ${item.iconColor} transition-transform group-hover:scale-110`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="mb-3 text-lg font-bold text-slate-900">{item.name}</h3>
                  <p className="text-sm leading-relaxed font-medium text-slate-500">
                    {item.description}
                  </p>
                </div>

                {/* Connecting Line (for desktop) */}
                {idx < steps.length - 1 && (
                  <div className="border-border absolute top-1/2 -right-4 z-10 hidden w-8 border-t border-dashed lg:block" />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
