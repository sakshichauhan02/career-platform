'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, CheckCircle2, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { MentorBookingModal } from '@/components/common/MentorBookingModal';

export function MentorSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBooking = () => {
    trackEvent('mentor_booking_clicked', {
      mentorName: 'Sakshi Chauhan',
      sessionType: '1:1 Career Guidance',
      price: '₹99',
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="border-border relative border-t bg-slate-50/50 py-24">
        {/* Background soft glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-400/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Grid Layout */}
          <div className="items-center lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Content Left */}
            <div className="mb-12 lg:col-span-7 lg:mb-0 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/60 px-3.5 py-1 text-[11px] font-bold text-blue-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Direct Expert Mentorship
              </div>

              <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                1-on-1 Guidance from Your Career Mentor
              </h2>
              <p className="text-base leading-relaxed font-medium text-slate-500">
                AI recommendations give you scientific data, but speaking with an expert who has actually walked the path is invaluable. Verify your career plans, clear doubts, align parents, and chart a bulletproof action plan.
              </p>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="flex items-start gap-2.5">
                  <Video className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">30-Min Live Video Call</h4>
                    <p className="text-xs text-slate-500">Personalized Zoom/Google Meet session</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Flexible Scheduling</h4>
                    <p className="text-xs text-slate-500">Select slots that match your availability</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Stream & College Strategy</h4>
                    <p className="text-xs text-slate-500">Custom mapping matching your budget tier</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Parent-Student Alignment</h4>
                    <p className="text-xs text-slate-500">Involve your parents to resolve stream conflicts</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleBooking}
                  className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 active:scale-[0.98]"
                >
                  Book Slot Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            {/* Mentor Showcase Card Right */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-[360px] rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80"
                      alt="Sakshi Chauhan"
                      className="h-24 w-24 rounded-full border-4 border-blue-50 object-cover shadow-md"
                    />
                    <span className="absolute right-1 bottom-1 h-4.5 w-4.5 rounded-full border-2 border-white bg-emerald-500 animate-pulse" />
                  </div>

                  <h3 className="mt-4 text-lg font-black text-slate-950">Sakshi Chauhan</h3>
                  <p className="text-xs font-bold text-blue-600">Senior Academic Advisor & Mentor</p>

                  <div className="mt-2.5 flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-0.5 font-bold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> 4.9
                    </span>
                    <span>•</span>
                    <span>120+ bookings this month</span>
                  </div>

                  <div className="mt-6 w-full space-y-4 border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>Consultation Fee</span>
                      <span className="text-base font-black text-slate-950">₹99</span>
                    </div>

                    <Button
                      onClick={handleBooking}
                      className="group w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500 py-6 font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      Book 1:1 Career Guidance Session ₹99
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <MentorBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
