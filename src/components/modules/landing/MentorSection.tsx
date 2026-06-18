'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mentors = [
  {
    name: 'Siddharth Sen',
    role: 'Ex-Google Product Lead',
    alma: 'IIT Kharagpur',
    stream: 'PCM & Tech Careers',
    avatarBg: 'bg-indigo-500/10 text-indigo-400',
  },
  {
    name: 'Dr. Anjali Rao',
    role: 'Medical Advisor & Surgeon',
    alma: 'AIIMS, New Delhi',
    stream: 'PCB & Medical Sciences',
    avatarBg: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    name: 'Megha Gupta',
    role: 'Senior Strategy Consultant',
    alma: 'ISB Hyderabad',
    stream: 'Commerce & Management',
    avatarBg: 'bg-violet-500/10 text-violet-400',
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function MentorSection() {
  return (
    <section className="relative border-t border-slate-900 bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grids Layout */}
        <div className="items-center lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Content Left */}
          <div className="mb-12 lg:col-span-5 lg:mb-0">
            <h2 className="text-3xl leading-tight font-extrabold text-white sm:text-4xl">
              1-on-1 Guidance from Top Industry Mentors
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-400">
              AI recommendation gives you scientific data, but speaking with someone who has
              actually walked the path is invaluable. Verify your career plans with leaders from top
              universities and global companies.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                Verified profiles from IITs, AIIMs, and Tier-1 colleges.
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                Stream verification and year-by-year entrance strategies.
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                30-minute interactive live video calls.
              </li>
            </ul>

            <div className="mt-8">
              <Link href="/quiz">
                <Button className="group flex items-center gap-2 bg-indigo-600 font-semibold text-white hover:bg-indigo-700">
                  Book Slot Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mentors Grid Right */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-6 lg:col-span-7"
          >
            {mentors.map((mentor) => (
              <motion.div
                key={mentor.name}
                variants={itemVariants}
                className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-900 bg-slate-900/10 p-5 transition-all duration-300 hover:border-slate-800 hover:bg-slate-900/20 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar Placeholder with initials */}
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold ${mentor.avatarBg}`}
                  >
                    {mentor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{mentor.name}</h3>
                    <p className="mt-0.5 text-xs font-medium text-slate-400">
                      {mentor.role} &bull; {mentor.alma}
                    </p>
                    <span className="mt-2 inline-block rounded-full border border-slate-800 bg-slate-900 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
                      {mentor.stream}
                    </span>
                  </div>
                </div>

                <Link href="/quiz">
                  <Button
                    variant="outline"
                    className="border-slate-850 flex h-10 w-full items-center gap-2 px-4 text-xs font-semibold text-slate-300 hover:bg-slate-900 hover:text-white sm:w-auto"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Call
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
