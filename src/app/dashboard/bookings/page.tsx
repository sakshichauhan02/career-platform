'use client';

import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { MentorBookingSection } from '@/components/common/MentorBookingSection';
import { Video, Clock, MessageSquare } from 'lucide-react';

export default function BookingsPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50/50 text-slate-900 selection:bg-blue-50">
      <Navbar />

      <main className="container mx-auto max-w-6xl flex-grow space-y-12 px-4 py-24">
        {/* Page Header */}
        <div className="mx-auto max-w-2xl space-y-3 text-center">
          <h1 className="text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl">
            Personalized 1-on-1 Career Mentorship
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Book a dedicated consultation session to review your AI career pathway, select academic
            streams, and plan your higher education roadmap.
          </p>
        </div>

        {/* Centerpiece Mentor Booking Card */}
        <MentorBookingSection variant="full" />

        {/* Session Details Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">30-Minute Live Consultation</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              A high-focus, private video session with Sakshi Chauhan to discuss your career fit
              match recommendations, interests, and aspirations.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Parents-Student Alignment</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Parents are highly encouraged to join to align on stream choices, college budgets, and
              career trajectories with a neutral industry expert.
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Video className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Actionable Roadmap</h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Get an immediate post-session execution plan detailing entrance exams, preparation
              books, and board subject choices to target.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-slate-905 text-center text-xl font-black">
            Frequently Asked Questions
          </h2>

          <div className="grid gap-6 text-xs md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="flex items-start gap-2 font-bold text-slate-900">
                <span className="font-extrabold text-blue-600">Q.</span>
                Who is this consultation session for?
              </h3>
              <p className="pl-5 leading-relaxed text-slate-500">
                This session is specially designed for students of classes 10, 11, and 12, as well
                as college applicants looking to select their academic stream, choose board
                subjects, or find high-fit colleges matching their budget.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-start gap-2 font-bold text-slate-900">
                <span className="font-extrabold text-blue-600">Q.</span>
                How does the Topmate booking work?
              </h3>
              <p className="text-slate-550 pl-5 leading-relaxed">
                When you click book, you will be redirected to Topmate, our trusted booking partner.
                You can select your preferred date, choose an available time slot, complete the ₹99
                payment securely, and get an instant Google Meet/Zoom link.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-start gap-2 font-bold text-slate-900">
                <span className="font-extrabold text-blue-600">Q.</span>
                Can my parents join the video call?
              </h3>
              <p className="text-slate-550 pl-5 leading-relaxed">
                Yes, absolutely! We highly recommend that parents join the call, as key career and
                educational decisions are best made with combined alignment on streams, interests,
                and college budgets.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-start gap-2 font-bold text-slate-900">
                <span className="font-extrabold text-blue-600">Q.</span>
                What if I need to reschedule my session?
              </h3>
              <p className="text-slate-550 pl-5 leading-relaxed">
                You can easily reschedule your session directly through the link in your Topmate
                confirmation email up to 2 hours before the scheduled time, at no extra cost.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
