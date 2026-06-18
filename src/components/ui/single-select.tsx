'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SingleSelectOption<T = string | number> {
  value: T;
  label: string;
  desc?: string;
  icon?: LucideIcon;
}

interface SingleSelectProps<T> {
  options: SingleSelectOption<T>[];
  selectedValue: T | null;
  onChange: (value: T) => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function SingleSelect<T extends string | number>({
  options,
  selectedValue,
  onChange,
  columns = 2,
  className,
}: SingleSelectProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Keyboard Navigation handler
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (index + 1) % options.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (index - 1 + options.length) % options.length;
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(options[index].value);
    }

    if (nextIndex !== -1 && containerRef.current) {
      const buttons = containerRef.current.querySelectorAll('[role="radio"]');
      (buttons[nextIndex] as HTMLButtonElement).focus();
      onChange(options[nextIndex].value);
    }
  };

  const getGridCols = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 3:
        return 'grid-cols-1 sm:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      case 2:
      default:
        return 'grid-cols-1 sm:grid-cols-2';
    }
  };

  const isNoneSelected = selectedValue === null;

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Selection options"
      className={cn('grid gap-4', getGridCols(), className)}
    >
      {options.map((opt, index) => {
        const Icon = opt.icon;
        const isSelected = selectedValue === opt.value;

        return (
          <motion.button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : isNoneSelected && index === 0 ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => onChange(opt.value)}
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'flex items-start gap-4 rounded-xl border p-4 text-left transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 focus:outline-none',
              isSelected
                ? 'border-indigo-500 bg-indigo-950/45 shadow-lg shadow-indigo-500/10'
                : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
            )}
          >
            {Icon && (
              <div
                className={cn(
                  'rounded-lg p-2.5 transition-colors duration-300',
                  isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
            )}
            <div className="space-y-1">
              <p className="font-semibold text-white">{opt.label}</p>
              {opt.desc && <p className="text-xs leading-relaxed text-slate-400">{opt.desc}</p>}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
