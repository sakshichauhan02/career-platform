'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    type: 'Student',
    quote:
      'I was overwhelmed by engineering branches. The vector recommendations matched me to UI/UX and Human-Computer Interaction rather than standard IT. It helped me choose the right specialization at BITS.',
    author: 'Aarav Mehta',
    role: 'Class 12 Student',
    location: 'Mumbai',
    rating: 5,
  },
  {
    type: 'Parent',
    quote:
      "As parents, we were confused between PCM and Commerce for our daughter. PathWayAI's assessment showed her high aptitude for mathematical finance. The AI report was incredibly detailed and the mentor session confirmed it.",
    author: 'Rajesh Sharma',
    role: 'Parent of Tanya (Class 10)',
    location: 'New Delhi',
    rating: 5,
  },
  {
    type: 'Mentor',
    quote:
      'The AI assessment reports make my mentoring sessions 10x more effective. The vectors identify interest alignments beforehand, allowing us to spend full time on exam strategy and college applications.',
    author: 'Siddharth Sen',
    role: 'Ex-Google Product Lead / Mentor',
    location: 'IIT Kharagpur Alum',
    rating: 5,
  },
  {
    type: 'Student',
    quote:
      'PathWayAI helped me select my Humanities stream subjects in Class 11. It gave me a roadmap for Law entrance preparation and recommended exactly which college specializations to target.',
    author: 'Priya Nair',
    role: 'Class 11 Student',
    location: 'Bengaluru',
    rating: 5,
  },
  {
    type: 'Parent',
    quote:
      'Getting my son to study was hard because he did not have a clear goal. The platform matched him with bio-sciences and healthcare analytics. Now he knows exactly what exams to write and is highly motivated.',
    author: 'Suman Verma',
    role: 'Parent of Rohan (Class 12)',
    location: 'Pune',
    rating: 5,
  },
];

export function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIdx((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4500); // changes slide every 4.5s
    return () => clearInterval(timer);
  }, [handleNext]);

  // Framer Motion sliding animations
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4 },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: { duration: 0.3 },
    }),
  };

  const current = testimonials[activeIdx];

  return (
    <section className="relative overflow-hidden border-t border-slate-900 bg-slate-950 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Loved by Students, Parents & Mentors
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Real stories from families and guides who achieved complete career clarity.
          </p>
        </div>

        {/* Carousel Slider Panel */}
        <div className="relative mx-auto flex min-h-[320px] max-w-3xl items-center justify-center rounded-3xl border border-slate-900 bg-slate-900/10 p-8 shadow-2xl backdrop-blur-xl sm:min-h-[260px] sm:p-12">
          <Quote className="pointer-events-none absolute top-8 right-8 h-12 w-12 text-slate-800/35" />

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIdx}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full text-left"
            >
              {/* Testimonial Type Badge */}
              <span
                className={`mb-6 inline-block rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${
                  current.type === 'Student'
                    ? 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400'
                    : current.type === 'Parent'
                      ? 'border-violet-500/20 bg-violet-500/10 text-violet-400'
                      : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                }`}
              >
                {current.type} Review
              </span>

              {/* Star Rating */}
              <div className="mb-4 flex gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="fill-amber-450 text-amber-450 h-4 w-4" />
                ))}
              </div>

              {/* Quote Text */}
              <p className="mb-8 text-base leading-relaxed text-slate-300 italic sm:text-lg">
                &quot;{current.quote}&quot;
              </p>

              {/* Author Info */}
              <div className="border-slate-850/80 flex items-center justify-between border-t pt-4">
                <div>
                  <h4 className="text-base font-bold text-white">{current.author}</h4>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {current.role} &bull; {current.location}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dot Indicators */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={handlePrev}
            className="rounded-full border border-slate-900 bg-slate-950 p-2 text-slate-400 transition-colors hover:border-slate-800 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > activeIdx ? 1 : -1);
                  setActiveIdx(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIdx === idx ? 'w-6 bg-indigo-500' : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="rounded-full border border-slate-900 bg-slate-950 p-2 text-slate-400 transition-colors hover:border-slate-800 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
