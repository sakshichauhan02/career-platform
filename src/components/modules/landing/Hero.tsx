'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, Compass, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 pt-24 pb-16">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-10 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:4rem_4rem] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400"
        >
          <Sparkles className="h-3.5 w-3.5 animate-spin" />
          AI-Powered Career & Course Finder
        </motion.div>

        {/* Headings */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-6xl sm:leading-none"
        >
          Confused About What To Do{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            After 12th?
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 sm:text-xl"
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
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all duration-300 hover:bg-indigo-700 sm:w-auto"
            >
              Find My Career Path
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/courses">
            <Button
              size="lg"
              variant="outline"
              className="h-12 w-full rounded-xl border-slate-800 px-8 text-base text-slate-300 hover:bg-slate-900 hover:text-white sm:w-auto"
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
          className="shadow-indigo-550/10 relative mx-auto mt-16 max-w-5xl rounded-2xl border border-slate-800 bg-slate-900/40 p-4 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center gap-2 border-b border-slate-800 pb-3 text-slate-500">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-4 font-mono text-xs text-slate-500">pathway-ai-dashboard.sh</span>
          </div>

          <div className="grid grid-cols-1 gap-4 text-left md:grid-cols-3">
            <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="rounded-lg bg-indigo-500/15 p-2.5 text-indigo-400">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">TOP CAREER MATCH</p>
                <h4 className="mt-1 text-base font-semibold text-white">Data Scientist</h4>
                <p className="mt-1 text-xs text-slate-400">94% Match Probability</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="rounded-lg bg-violet-500/15 p-2.5 text-violet-400">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">STREAM ADVISORY</p>
                <h4 className="mt-1 text-base font-semibold text-white">PCM + Computer Science</h4>
                <p className="mt-1 text-xs text-slate-400">Aligned with target interests</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
              <div className="rounded-lg bg-emerald-500/15 p-2.5 text-emerald-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">TOP COLLEGE PICK</p>
                <h4 className="mt-1 text-base font-semibold text-white">BITS Pilani</h4>
                <p className="mt-1 text-xs text-slate-400">Admission Index: 88</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
