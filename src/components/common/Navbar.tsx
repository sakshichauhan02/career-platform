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
    <nav className="fixed top-0 right-0 left-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
          >
            <Compass className="h-6 w-6 animate-pulse text-indigo-500" />
            <span>
              PathWay<span className="text-indigo-500">AI</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-white"
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
                className="text-slate-300 hover:bg-slate-800/50 hover:text-white"
              >
                Log In
              </Button>
            </Link>
            <Link href="/quiz">
              <Button className="group flex items-center gap-1.5 bg-indigo-600 font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700">
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
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
            className="border-slate-850 border-b bg-slate-950/95 md:hidden"
          >
            <div className="space-y-1 px-4 py-4 sm:px-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white"
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-6 flex flex-col gap-3 border-t border-slate-800/80 pt-4">
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button
                    variant="ghost"
                    className="w-full text-slate-300 hover:bg-slate-800/50 hover:text-white"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/quiz" onClick={() => setIsOpen(false)} className="w-full">
                  <Button className="w-full bg-indigo-600 font-semibold text-white hover:bg-indigo-700">
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
