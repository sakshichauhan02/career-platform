'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Terminal,
  LineChart,
  Palette,
  Stethoscope,
  Scale,
  BookMarked,
  ArrowUpRight,
} from 'lucide-react';

const categories = [
  {
    name: 'Engineering & Tech',
    icon: Terminal,
    coursesCount: 82,
    avgSalary: '₹8-22 LPA',
    color: 'from-blue-500/20 to-indigo-500/20 text-indigo-400',
    topPick: 'AI, Cyber Security, Software Eng.',
  },
  {
    name: 'Business & Commerce',
    icon: LineChart,
    coursesCount: 65,
    avgSalary: '₹6-18 LPA',
    color: 'from-violet-500/20 to-purple-500/20 text-violet-400',
    topPick: 'FinTech, Data Analytics, Actuarial Sci.',
  },
  {
    name: 'Design & Creative Arts',
    icon: Palette,
    coursesCount: 48,
    avgSalary: '₹5-14 LPA',
    color: 'from-pink-500/20 to-rose-500/20 text-rose-400',
    topPick: 'UI/UX Design, Animation, Fashion Tech.',
  },
  {
    name: 'Medical & Bio Sciences',
    icon: Stethoscope,
    coursesCount: 39,
    avgSalary: '₹9-26 LPA',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    topPick: 'BioTechnology, Genetics, Clinical Res.',
  },
  {
    name: 'Law & Public Policy',
    icon: Scale,
    coursesCount: 22,
    avgSalary: '₹7-16 LPA',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    topPick: 'Cyber Law, Corporate Law, Policy Res.',
  },
  {
    name: 'Humanities & Social Sci.',
    icon: BookMarked,
    coursesCount: 34,
    avgSalary: '₹4-11 LPA',
    color: 'from-cyan-500/20 to-sky-500/20 text-cyan-400',
    topPick: 'Clinical Psychology, Liberal Arts, Jour.',
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Categories() {
  return (
    <section className="relative border-t border-slate-900 bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Explore Popular Career Fields
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Unlock detailed insights for 500+ career paths mapped to Class 12 streams (Science,
              Commerce, Arts).
            </p>
          </div>
          <Link href="/courses">
            <span className="group flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300">
              View all 500+ careers
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                variants={itemVariants}
                className="group flex flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/10 p-6 transition-all duration-300 hover:border-slate-800 hover:bg-slate-900/20"
              >
                <div>
                  {/* Icon & Title */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className={`rounded-xl bg-gradient-to-r p-3 ${item.color} flex-shrink-0`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-indigo-400">
                      {item.name}
                    </h3>
                  </div>

                  {/* Top Picks */}
                  <p className="mb-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Trending Specialties
                  </p>
                  <p className="mb-6 text-sm font-medium text-slate-300">{item.topPick}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between border-t border-slate-900/80 pt-4 text-xs font-semibold">
                  <div>
                    <span className="block text-slate-500">COURSES</span>
                    <span className="mt-1 block text-slate-300">{item.coursesCount} Programs</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-slate-500">AVG. PACKAGE</span>
                    <span className="mt-1 block font-mono text-emerald-400">{item.avgSalary}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
