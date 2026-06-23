'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, Compass, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden pt-28 pb-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Soft radial glow in center/top */}
        <div className="pointer-events-none absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-400/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:4rem_4rem] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-blue-200/60 bg-white/70 px-4 py-1.5 text-xs font-bold text-blue-600 shadow-sm backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-blue-500" />
          AI-Powered Career & Course Finder
        </motion.div>

        {/* Headings */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="sm:text-6.5xl mx-auto max-w-4xl text-4xl leading-tight font-extrabold tracking-tight text-slate-900 sm:leading-none"
        >
          Confused About What To Do{' '}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            After 12th?
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg font-medium text-slate-500 sm:text-xl"
        >
          Discover the right course, college and career path in just 5 minutes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/quiz">
            <Button
              size="lg"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-8 text-base font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 hover:shadow-xl active:scale-[0.98] sm:w-auto"
            >
              Find My Career Path
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/courses">
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-full border-slate-200 bg-white px-8 text-base font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
            >
              Explore Courses
            </Button>
          </Link>
        </motion.div>

        {/* Animated Dashboard Graphic */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border-border relative mx-auto mt-16 max-w-5xl rounded-3xl border bg-white p-5 shadow-xl shadow-blue-500/5 backdrop-blur-xl"
        >
          <div className="border-border mb-4 flex items-center gap-2 border-b pb-3">
            <div className="h-3 w-3 rounded-full bg-red-400" />
            <div className="h-3 w-3 rounded-full bg-yellow-400" />
            <div className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-4 font-mono text-xs font-semibold text-slate-400">
              pathway-ai-dashboard.sh
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-3">
            <div className="border-border flex items-start gap-3 rounded-2xl border bg-slate-50/50 p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400">
                  TOP CAREER MATCH
                </p>
                <h4 className="mt-1 text-base font-bold text-slate-900">Data Scientist</h4>
                <p className="mt-0.5 text-xs font-semibold text-blue-600">94% Match Probability</p>
              </div>
            </div>

            <div className="border-border flex items-start gap-3 rounded-2xl border bg-slate-50/50 p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400">
                  STREAM ADVISORY
                </p>
                <h4 className="mt-1 text-base font-bold text-slate-900">PCM + Computer Science</h4>
                <p className="mt-0.5 text-xs text-slate-500">Aligned with target interests</p>
              </div>
            </div>

            <div className="border-border flex items-start gap-3 rounded-2xl border bg-slate-50/50 p-4 transition-all duration-300 hover:scale-[1.01] hover:shadow-sm">
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-slate-400">
                  TOP COLLEGE PICK
                </p>
                <h4 className="mt-1 text-base font-bold text-slate-900">BITS Pilani</h4>
                <p className="mt-0.5 text-xs font-semibold text-emerald-600">Admission Index: 88</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
