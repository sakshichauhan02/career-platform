'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MultiSelectOption<T = string | number> {
  value: T;
  label: string;
  desc?: string;
  icon?: LucideIcon;
}

interface MultiSelectProps<T> {
  options: MultiSelectOption<T>[];
  selectedValues: T[];
  onChange: (values: T[]) => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function MultiSelect<T extends string | number>({
  options,
  selectedValues,
  onChange,
  columns = 2,
  className,
}: MultiSelectProps<T>) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggleValue = (val: T) => {
    const updated = [...selectedValues];
    const idx = updated.indexOf(val);
    if (idx > -1) {
      updated.splice(idx, 1);
    } else {
      updated.push(val);
    }
    onChange(updated);
  };

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
      toggleValue(options[index].value);
    }

    if (nextIndex !== -1 && containerRef.current) {
      const buttons = containerRef.current.querySelectorAll('[role="checkbox"]');
      (buttons[nextIndex] as HTMLButtonElement).focus();
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

  return (
    <div className="space-y-4">
      {/* Visual top counter/row for current choices */}
      <div className="border-border min-h-12 rounded-3xl border border-dashed bg-slate-50/50 p-3">
        {selectedValues.length === 0 ? (
          <p className="py-2 text-center text-xs font-semibold text-slate-400">
            No selections yet. Click options below to choose.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedValues.map((val) => {
                const opt = options.find((o) => o.value === val);
                const label = opt ? opt.label : String(val);
                return (
                  <motion.span
                    key={String(val)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 shadow-sm"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => toggleValue(val)}
                      className="rounded-full p-0.5 hover:bg-blue-100 hover:text-blue-700 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.span>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Grid selector */}
      <div
        ref={containerRef}
        role="group"
        aria-label="Multi-select choices"
        className={cn('grid gap-3', getGridCols(), className)}
      >
        {options.map((opt, index) => {
          const Icon = opt.icon;
          const isSelected = selectedValues.includes(opt.value);

          return (
            <motion.button
              key={String(opt.value)}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={index === 0 ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => toggleValue(opt.value)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                'flex items-center gap-3 rounded-3xl border p-3.5 text-left shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none',
                isSelected
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-border bg-white hover:border-blue-500/20 hover:bg-slate-50/50'
              )}
            >
              {Icon && (
                <div
                  className={cn(
                    'rounded-2xl p-2 transition-colors duration-250',
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <div className="flex-1 space-y-0.5 pr-4">
                <p className="text-sm leading-none font-bold text-slate-900">{opt.label}</p>
                {opt.desc && (
                  <p className="mt-1 text-[11px] leading-tight font-medium text-slate-500">
                    {opt.desc}
                  </p>
                )}
              </div>

              {/* Checkbox circle indicator */}
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-lg border transition-all duration-200',
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-border bg-white hover:border-blue-500/20'
                )}
              >
                {isSelected && (
                  <svg
                    className="h-3 w-3 fill-current"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
