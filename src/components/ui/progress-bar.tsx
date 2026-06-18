'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  showLabel?: boolean;
}

export function ProgressBar({ value, showLabel = false, className, ...props }: ProgressBarProps) {
  const boundedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('w-full space-y-1.5', className)} {...props}>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${boundedValue}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      {showLabel && (
        <div className="flex justify-end text-[10px] font-bold text-indigo-400">
          <span>{boundedValue}% Complete</span>
        </div>
      )}
    </div>
  );
}
