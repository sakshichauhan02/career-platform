'use client';

import Link from 'next/link';
import { Compass, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-border border-t bg-slate-50/50 text-slate-500">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Info */}
          <div className="space-y-6 xl:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-950"
            >
              <Compass className="h-6 w-6 text-blue-600" />
              <span>
                PathWay<span className="text-blue-600">AI</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              Empowering students of class 10, 11, and 12 to make informed career and course choices
              with precision AI recommendations and 1-on-1 expert mentor interactions.
            </p>
            <div className="flex space-x-5">
              <Link
                href="https://twitter.com"
                className="text-slate-400 transition-colors duration-200 hover:text-blue-600"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="text-slate-400 transition-colors duration-200 hover:text-blue-600"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com"
                className="text-slate-400 transition-colors duration-200 hover:text-blue-600"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Nav Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                Platform
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/quiz"
                    className="text-sm text-slate-500 transition-colors duration-150 hover:text-blue-600"
                  >
                    Career Quiz
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/report"
                    className="text-sm text-slate-500 transition-colors duration-150 hover:text-blue-600"
                  >
                    AI Recommendation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/bookings"
                    className="text-sm text-slate-500 transition-colors duration-150 hover:text-blue-600"
                  >
                    Mentor Booking
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                Exploration
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/courses"
                    className="text-sm text-slate-500 transition-colors duration-150 hover:text-blue-600"
                  >
                    Course Database
                  </Link>
                </li>
                <li>
                  <Link
                    href="/colleges"
                    className="text-sm text-slate-500 transition-colors duration-150 hover:text-blue-600"
                  >
                    College Explorer
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                Subscribe to Newsletter
              </h3>
              <p className="mt-4 text-sm text-slate-500">
                Get the latest updates on careers, streams, and entrance exams.
              </p>
              <form className="mt-4 max-w-md gap-2 sm:flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  required
                  placeholder="Parent / Student Email"
                  className="border-border w-full min-w-0 rounded-xl border bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
                <Button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 font-medium text-white transition-all hover:from-blue-700 hover:to-blue-600 sm:mt-0 sm:w-auto"
                >
                  Join
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs text-slate-400 md:flex-row">
          <p>&copy; {new Date().getFullYear()} PathWayAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-blue-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-blue-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
