'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Compass, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Career Quiz', href: '/quiz' },
  { name: 'Courses', href: '/courses' },
  { name: 'Colleges', href: '/colleges' },
  { name: 'Book Mentor', href: '/dashboard/bookings' },
  { name: 'Admin CMS', href: '/admin' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-border/80 fixed top-0 right-0 left-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900"
          >
            <Compass className="h-6 w-6 animate-pulse text-blue-600" />
            <span>
              PathWay<span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/login">
              <Button
                variant="ghost"
                className="rounded-full font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-950"
              >
                Log In
              </Button>
            </Link>
            <Link href="/quiz">
              <Button className="group flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2 font-bold text-white shadow-md shadow-blue-500/10 transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="border-border border-b bg-white/95 backdrop-blur-md md:hidden"
          >
            <div className="space-y-1 px-4 py-4 sm:px-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl px-3 py-2 text-base font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-blue-600"
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-border mt-6 flex flex-col gap-3 border-t pt-4">
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full rounded-full font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/quiz" onClick={() => setIsOpen(false)} className="w-full">
                  <Button className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500 font-bold text-white hover:from-blue-700 hover:to-blue-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
