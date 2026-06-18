'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function QuestionCard({
  title,
  description,
  icon: Icon,
  children,
  className,
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className={cn('space-y-6', className)}
    >
      <div className="text-center">
        {Icon && (
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
      </div>

      <div className="mt-6">{children}</div>
    </motion.div>
  );
}
