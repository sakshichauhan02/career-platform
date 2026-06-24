'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { MentorBookingSection } from '@/components/common/MentorBookingSection';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Award,
  Briefcase,
  ArrowRight,
  FileText,
  CheckCircle2,
  Brain,
  Compass,
  TrendingUp,
} from 'lucide-react';
import { ScoredCourse } from '@/services/recommendationEngine';
import { AssessmentData } from '@/types/assessment';

const EDUCATION_LABELS: Record<string, string> = {
  school_10th: '10th Standard',
  school_11th: '11th Standard',
  school_12th_pcm: '12th (PCM)',
  school_12th_pcb: '12th (PCB)',
  school_12th_commerce: '12th (Commerce)',
  school_12th_arts: '12th (Arts)',
  graduate: 'Graduate',
};

export default function StudentDashboard() {
  const [profile, setProfile] = useState<
    (AssessmentData & { name?: string; email?: string }) | null
  >(null);
  const [recommendations, setRecommendations] = useState<ScoredCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const localData = localStorage.getItem('pathway_latest_results');
    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.recommendations) setRecommendations(parsed.recommendations);
      } catch (err) {
        console.error('Failed to parse dashboard data from localStorage:', err);
      }
    }
    setIsLoading(false);
  }, []);

  const topCourse = recommendations[0];

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50/50 text-slate-900 selection:bg-blue-50">
      <Navbar />

      <main className="container mx-auto max-w-6xl flex-grow px-4 py-24">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-32">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            <p className="text-sm font-medium text-slate-500">Loading your student dashboard...</p>
          </div>
        ) : profile && recommendations.length > 0 ? (
          /* Active Student Dashboard */
          <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl leading-tight font-black tracking-tight text-slate-900">
                  Welcome Back, {profile.name || 'Student'}! 👋
                </h1>
                <p className="text-sm font-medium text-slate-500">
                  Here is your career preparation status, recommended pathways, and next steps.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/dashboard/report">
                  <Button className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-600 active:scale-[0.98]">
                    View Full Report
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Stat 1 */}
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    Top Career Match
                  </span>
                  <Award className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="truncate text-base font-bold text-slate-900">
                    {topCourse?.course.name}
                  </h3>
                  <p className="flex items-center gap-1 text-xs font-semibold text-blue-600">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    {topCourse?.score}% AI Fit Match
                  </p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    Academic Profile
                  </span>
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {profile.educationLevel
                      ? EDUCATION_LABELS[profile.educationLevel] || 'School'
                      : 'School Student'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    Stream: {profile.stream ? profile.stream.toUpperCase() : 'General'}
                  </p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    Next Action
                  </span>
                  <Compass className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Mentor Call Pending</h3>
                  <p className="text-xs font-semibold text-emerald-600">
                    ₹99 Special Advisor Slot Available
                  </p>
                </div>
              </div>
            </div>

            {/* Main Section Grid */}
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Recommended Pathways List (Left Column) */}
              <div className="space-y-6 lg:col-span-8">
                <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-base font-black text-slate-950">
                      Top Recommended Career Pathways
                    </h2>
                    <Link
                      href="/dashboard/report"
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Detailed Analysis
                    </Link>
                  </div>

                  <div className="space-y-5">
                    {recommendations.slice(0, 3).map((item, idx) => (
                      <div
                        key={item.course.id}
                        className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/30 p-4 transition-all hover:bg-slate-50/60 sm:flex-row sm:items-center"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-600">
                              {idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{item.course.name}</h4>
                          </div>
                          <p className="line-clamp-1 max-w-md text-xs text-slate-500">
                            {item.course.description}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center justify-between gap-6 border-t border-slate-100 pt-2 sm:justify-end sm:border-t-0 sm:pt-0">
                          <div className="space-y-0.5 text-right">
                            <span className="text-xs font-bold text-slate-900">{item.score}%</span>
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500"
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                          </div>
                          <Link href="/dashboard/report">
                            <Button
                              variant="outline"
                              className="h-8 rounded-full border-slate-200 px-3 text-[10px] font-bold text-slate-600 hover:bg-slate-100"
                            >
                              Explore
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Checklist (Right Column) */}
              <div className="space-y-6 lg:col-span-4">
                <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="border-b border-slate-100 pb-3 text-sm font-black text-slate-950">
                    Your Action Checklist
                  </h3>

                  <div className="space-y-4 text-xs font-medium">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                      <div>
                        <h4 className="font-bold text-slate-900">Complete Career Assessment</h4>
                        <p className="mt-0.5 text-[10px] text-slate-400">Completed successfully</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                      <div>
                        <h4 className="font-bold text-slate-900">Review AI Pathway Report</h4>
                        <p className="mt-0.5 text-[10px] text-slate-400">Completed successfully</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-blue-500/20">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Book Expert Consultation</h4>
                        <p className="mt-0.5 text-[10px] font-bold text-blue-600">
                          Recommended next step (₹99)
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 opacity-60">
                      <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-slate-200" />
                      <div>
                        <h4 className="font-bold text-slate-900">Apply to Target Colleges</h4>
                        <p className="mt-0.5 text-[10px] text-slate-400">
                          Unlock after advisor call
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-md">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold tracking-wider text-blue-100 uppercase">
                      Premium Benefits
                    </h3>
                    <h4 className="text-lg leading-snug font-extrabold">
                      Unlock College Fit Explorer
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed text-blue-100">
                    Instantly match 100+ colleges based on your stream, budget limits, and academic
                    priorities.
                  </p>
                  <Link href="/colleges" className="block">
                    <Button className="w-full rounded-full bg-white py-4 text-xs font-bold text-blue-700 shadow-sm hover:bg-slate-50">
                      Open College Explorer
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Mentor Section */}
            <div className="mt-8">
              <MentorBookingSection variant="full" />
            </div>
          </div>
        ) : (
          /* Empty / Fallback State */
          <div className="space-y-12">
            <div className="mx-auto max-w-3xl space-y-8 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                <Brain className="h-8 w-8 animate-pulse" />
              </div>

              <div className="mx-auto max-w-xl space-y-3">
                <h1 className="text-3xl leading-tight font-black tracking-tight text-slate-900">
                  Welcome to PathWayAI! 🚀
                </h1>
                <p className="text-sm leading-relaxed font-medium text-slate-500">
                  You haven&apos;t completed your career assessment quiz yet. Unlock 100% precise career
                  stream recommendations, college compatibility match scores, and direct advisor
                  guidance by taking our 5-minute quiz.
                </p>
              </div>

              <div>
                <Link href="/quiz">
                  <Button className="group rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 text-xs font-bold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-600 active:scale-[0.98]">
                    Start Career Assessment Quiz
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mentor Section even in fallback state */}
            <div className="mt-8">
              <MentorBookingSection variant="full" />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
