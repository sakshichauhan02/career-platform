'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Calendar, Video, CheckCircle2, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { MentorBookingModal } from '@/components/common/MentorBookingModal';

interface MentorBookingSectionProps {
  className?: string;
  variant?: 'full' | 'card';
}

export function MentorBookingSection({
  className = '',
  variant = 'full',
}: MentorBookingSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBooking = () => {
    trackEvent('mentor_booking_clicked', {
      mentorName: 'Sakshi Chauhan',
      sessionType: '1:1 Career Guidance',
      price: '₹99',
    });
    setIsModalOpen(true);
  };

  if (variant === 'card') {
    return (
      <>
        <div
          className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80"
                alt="Sakshi Chauhan"
                className="h-12 w-12 rounded-full border border-blue-100 object-cover"
              />
              <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-950">Sakshi Chauhan</h4>
              <p className="text-[11px] font-semibold text-blue-600">
                Senior Academic Advisor & Mentor
              </p>
              <div className="mt-0.5 flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                <span className="flex items-center gap-0.5 font-bold text-amber-500">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> 4.9
                </span>
                <span>•</span>
                <span>120+ sessions</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 py-4">
            <h3 className="text-sm leading-snug font-bold text-slate-900">
              Book 1:1 Personal Career Guidance Session
            </h3>
            <p className="text-xs leading-relaxed text-slate-500">
              Get personalized support to analyze your AI recommendations, select academic streams,
              and build your college roadmap.
            </p>

            <ul className="space-y-2 text-[11px] font-medium text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                30-min live video consultation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                Tailored stream & college strategy
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-blue-600" />
                Direct parent Q&A session
              </li>
            </ul>
          </div>

          <Button
            onClick={handleBooking}
            className="group w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500 py-5 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:scale-[1.01] hover:from-blue-700 hover:to-blue-600 hover:shadow-lg active:scale-[0.99]"
          >
            Book 1:1 Career Guidance Session ₹99
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
        <MentorBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/20 p-8 shadow-sm ${className}`}
      >
        {/* Background soft glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-400/5 blur-3xl" />

        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Left side info */}
          <div className="space-y-6 md:max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/60 px-3.5 py-1 text-[11px] font-bold text-blue-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Direct Expert Consultation
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl leading-tight font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Struggling to choose the right career path?
              </h2>
              <p className="text-sm leading-relaxed font-medium text-slate-500">
                AI predictions give you the ideal direction, but talking to an admissions and career
                strategy expert helps you execute it. Book a private 1-on-1 video call to clear all
                doubts, align parents, and chart a bulletproof action plan.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2.5">
                <Video className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">30-Min Live Video Call</h4>
                  <p className="text-[11px] text-slate-500">Personalized Zoom/Google Meet session</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Flexible Scheduling</h4>
                  <p className="text-[11px] text-slate-500">
                    Select slots that match your availability
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Stream & College Strategy</h4>
                  <p className="text-[11px] text-slate-500">
                    Custom mapping matching your budget tier
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Parent-Student Alignment</h4>
                  <p className="text-[11px] text-slate-500">
                    Involve your parents to resolve stream conflicts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side mentor card */}
          <div className="shrink-0 rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-md shadow-slate-100/50 backdrop-blur-sm md:w-[320px]">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&q=80"
                  alt="Sakshi Chauhan"
                  className="h-20 w-20 rounded-full border-2 border-blue-50 object-cover shadow-sm"
                />
                <span className="absolute right-0.5 bottom-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              <h3 className="mt-4 text-base font-black text-slate-950">Sakshi Chauhan</h3>
              <p className="text-[11px] font-bold text-blue-600">Senior Academic Advisor</p>

              <div className="mt-2 flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-0.5 font-bold text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> 4.9
                </span>
                <span>•</span>
                <span>120+ bookings this month</span>
              </div>

              <div className="mt-5 w-full space-y-4 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-550">Consultation Fee</span>
                  <span className="text-sm font-black text-slate-950">₹99</span>
                </div>

                <Button
                  onClick={handleBooking}
                  className="group w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500 py-6 font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 hover:shadow-lg active:scale-[0.98]"
                >
                  Book 1:1 Career Guidance Session ₹99
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MentorBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
