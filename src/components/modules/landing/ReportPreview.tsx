'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  Compass,
  GraduationCap,
  Calendar,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ReportPreview() {
  return (
    <section className="relative overflow-hidden border-t border-slate-900 bg-slate-950 py-24">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/4 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          {/* Content Left */}
          <div className="space-y-6 lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400">
              Premium Report Preview
            </span>

            <h2 className="text-3xl leading-tight font-extrabold text-white sm:text-4xl">
              Unlock Your Detailed 15-Page AI Career Report
            </h2>

            <p className="text-base leading-relaxed text-slate-400">
              Get objective, scientific answers to your future. Our report provides a comprehensive
              mapping of streams, courses, entrance exams, and college recommendations customized
              for you.
            </p>

            {/* Checklist */}
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                Stream Fitment Matrix (PCM vs PCB vs Commerce vs Humanities)
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                Top 5 High-Demand Career Paths matched with vectors
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                Personalized Entrance Exams & Admissions Calendar
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                Top College Recommendations & Annual Fees Directories
              </li>
            </ul>

            {/* CTA */}
            <div className="pt-4">
              <Link href="/quiz">
                <Button
                  size="lg"
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-8 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 sm:w-auto"
                >
                  Unlock Full Report ₹49
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <p className="mt-3 text-xs text-slate-500 sm:ml-1">
                One-time payment. Unlocks immediate PDF download & dashboard dashboard access.
              </p>
            </div>
          </div>

          {/* Blurred Pages Preview Right */}
          <div className="relative flex min-h-[440px] items-center justify-center lg:col-span-6">
            {/* Background page 3 (Blurred) */}
            <div className="pointer-events-none absolute top-4 left-4 h-[360px] w-[280px] -rotate-6 transform rounded-2xl border border-slate-900 bg-slate-900/10 p-5 opacity-40 blur-[2px] transition-all duration-300 select-none">
              <div className="mb-6 h-4 w-1/3 rounded bg-slate-800" />
              <div className="space-y-4">
                <div className="h-2 w-full rounded bg-slate-800" />
                <div className="h-2 w-full rounded bg-slate-800" />
                <div className="h-2 w-2/3 rounded bg-slate-800" />
                <div className="bg-slate-850 mt-6 h-16 w-full rounded-lg" />
              </div>
            </div>

            {/* Background page 2 (Blurred with lock icon) */}
            <div className="pointer-events-none absolute top-4 right-4 flex h-[360px] w-[280px] rotate-6 transform flex-col justify-between rounded-2xl border border-slate-900 bg-slate-900/10 p-5 opacity-40 blur-[2px] transition-all duration-300 select-none">
              <div>
                <div className="mb-6 h-4 w-1/2 rounded bg-slate-800" />
                <div className="space-y-4">
                  <div className="h-2 w-full rounded bg-slate-800" />
                  <div className="h-2 w-5/6 rounded bg-slate-800" />
                  <div className="bg-slate-850 mt-4 h-12 w-full rounded-lg" />
                </div>
              </div>
              <div className="mb-8 flex justify-center">
                <div className="rounded-full border border-slate-700 bg-slate-800/80 p-3 text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Foreground visible Page 1 (Sample Insights) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative z-10 w-[310px] rounded-2xl border border-slate-900 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:w-[330px]"
            >
              {/* Header */}
              <div className="border-slate-850 mb-6 flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Sample Insights Page
                  </span>
                </div>
                <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[9px] font-bold text-indigo-400">
                  PAGE 01
                </span>
              </div>

              {/* Sample Content */}
              <div className="space-y-5">
                {/* Vector Match */}
                <div className="border-slate-850 rounded-xl border bg-slate-950/50 p-3.5">
                  <div className="mb-2.5 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <Compass className="h-3.5 w-3.5 text-indigo-400" />
                    CAREER VECTOR MATCHES
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>Software Engineering</span>
                      <span className="text-indigo-400">92%</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-white">
                      <span>Business Operations</span>
                      <span className="text-violet-400">76%</span>
                    </div>
                  </div>
                </div>

                {/* Stream Fit */}
                <div className="border-slate-850 rounded-xl border bg-slate-950/50 p-3.5">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <GraduationCap className="h-3.5 w-3.5 text-violet-400" />
                    STREAM COMPATIBILITY
                  </div>
                  <h4 className="text-xs leading-tight font-bold text-white">
                    PCM (Physics, Chemistry, Maths) + Computer Science
                  </h4>
                  <p className="mt-1 text-[10px] text-slate-500">
                    High analytical aptitude alignment detected.
                  </p>
                </div>

                {/* Exams */}
                <div className="border-slate-850 rounded-xl border bg-slate-950/50 p-3.5">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                    ENTRANCE EXAM TARGETS
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="border-slate-850 text-slate-350 rounded border bg-slate-900 px-2 py-0.5 text-[9px] font-bold">
                      JEE Main
                    </span>
                    <span className="border-slate-850 text-slate-350 rounded border bg-slate-900 px-2 py-0.5 text-[9px] font-bold">
                      BITSAT
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
