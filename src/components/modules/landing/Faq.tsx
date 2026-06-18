'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Is the career assessment free?',
    answer:
      'Yes! The basic career discovery quiz is 100% free to take. You can answer the questions and view your baseline career matches. To unlock the detailed 15-page PDF report and matching college listings, there is a small fee of ₹49.',
  },
  {
    question: 'How accurate are the career recommendations?',
    answer:
      'Our engine maps your interests and skills against 500+ career paths using a semantic vector similarity model (pgvector). The recommendations are scientifically aligned with standard psychometric parameters and can be validated during 1-on-1 calls with our expert mentors.',
  },
  {
    question: 'Who are the mentors?',
    answer:
      'Our mentors are verified professionals and alumni from Tier-1 institutions (like IITs, AIIMS, and BITS) and global companies (such as Google and McKinsey). They have walked the path themselves and provide actionable guidance.',
  },
  {
    question: 'What is the refund policy?',
    answer:
      'Since the premium PDF report is generated and made downloadable instantly upon payment, we generally do not offer refunds. However, if you experience transaction issues or are unsatisfied with a scheduled session, write to us and we will resolve it.',
  },
];

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="relative border-t border-slate-900 bg-slate-950 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Everything you need to know about our assessment, reports, and mentor slots.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/10 transition-colors duration-200 hover:border-slate-800"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-base font-semibold text-white focus:outline-none sm:text-lg"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <div className="border-t border-slate-950 px-6 pt-3 pb-5 text-sm leading-relaxed text-slate-400 sm:text-base">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
