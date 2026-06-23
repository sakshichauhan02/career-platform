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
    avatarBg: 'bg-blue-50 text-blue-600',
  },
  {
    name: 'Dr. Anjali Rao',
    role: 'Medical Advisor & Surgeon',
    alma: 'AIIMS, New Delhi',
    stream: 'PCB & Medical Sciences',
    avatarBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    name: 'Megha Gupta',
    role: 'Senior Strategy Consultant',
    alma: 'ISB Hyderabad',
    stream: 'Commerce & Management',
    avatarBg: 'bg-violet-50 text-violet-600',
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
    <section className="border-border relative border-t bg-slate-50/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Grids Layout */}
        <div className="items-center lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Content Left */}
          <div className="mb-12 lg:col-span-5 lg:mb-0">
            <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              1-on-1 Guidance from Top Industry Mentors
            </h2>
            <p className="mt-4 text-base leading-relaxed font-medium text-slate-500">
              AI recommendation gives you scientific data, but speaking with someone who has
              actually walked the path is invaluable. Verify your career plans with leaders from top
              universities and global companies.
            </p>

            <ul className="mt-8 space-y-4 text-sm font-semibold text-slate-600">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                Verified profiles from IITs, AIIMs, and Tier-1 colleges.
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                Stream verification and year-by-year entrance strategies.
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />
                30-minute interactive live video calls.
              </li>
            </ul>

            <div className="mt-8">
              <Link href="/quiz">
                <Button className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 active:scale-[0.98]">
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
                className="group border-border flex flex-col justify-between gap-4 rounded-3xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar Placeholder with initials */}
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl text-base font-bold ${mentor.avatarBg}`}
                  >
                    {mentor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{mentor.name}</h3>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">
                      {mentor.role} &bull; {mentor.alma}
                    </p>
                    <span className="mt-2 inline-block rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                      {mentor.stream}
                    </span>
                  </div>
                </div>

                <Link href="/quiz">
                  <Button
                    variant="outline"
                    className="border-slate-250 flex h-10 w-full items-center gap-2 rounded-full bg-white px-5 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
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
