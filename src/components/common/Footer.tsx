'use client';

import Link from 'next/link';
import { Compass, Github, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand Info */}
          <div className="space-y-6 xl:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
            >
              <Compass className="h-6 w-6 text-indigo-500" />
              <span>
                PathWay<span className="text-indigo-500">AI</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm text-slate-400">
              Empowering students of class 10, 11, and 12 to make informed career and course choices
              with precision AI recommendations and 1-on-1 expert mentor interactions.
            </p>
            <div className="flex space-x-5">
              <Link
                href="https://twitter.com"
                className="transition-colors duration-200 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                className="transition-colors duration-200 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com"
                className="transition-colors duration-200 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Nav Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                Platform
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/quiz"
                    className="text-sm transition-colors duration-150 hover:text-white"
                  >
                    Career Quiz
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/report"
                    className="text-sm transition-colors duration-150 hover:text-white"
                  >
                    AI Recommendation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/bookings"
                    className="text-sm transition-colors duration-150 hover:text-white"
                  >
                    Mentor Booking
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                Exploration
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/courses"
                    className="text-sm transition-colors duration-150 hover:text-white"
                  >
                    Course Database
                  </Link>
                </li>
                <li>
                  <Link
                    href="/colleges"
                    className="text-sm transition-colors duration-150 hover:text-white"
                  >
                    College Explorer
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase">
                Subscribe to Newsletter
              </h3>
              <p className="mt-4 text-sm text-slate-400">
                Get the latest updates on careers, streams, and entrance exams.
              </p>
              <form className="mt-4 max-w-md gap-2 sm:flex" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  required
                  placeholder="Parent / Student Email"
                  className="w-full min-w-0 rounded-md border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <Button
                  type="submit"
                  className="mt-2 w-full bg-indigo-600 font-medium text-white hover:bg-indigo-700 sm:mt-0 sm:w-auto"
                >
                  Join
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-900 pt-8 text-xs text-slate-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} PathWayAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-350">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-350">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
