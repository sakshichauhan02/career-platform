'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavigationButtonsProps {
  onPrev?: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextLabel?: string;
  prevLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export function NavigationButtons({
  onPrev,
  onNext,
  isFirstStep,
  isLastStep,
  nextLabel = 'Next',
  prevLabel = 'Back',
  isLoading = false,
  className,
}: NavigationButtonsProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <Button
        type="button"
        onClick={onPrev}
        disabled={isFirstStep || isLoading}
        variant="ghost"
        className="flex items-center gap-1.5 text-slate-400 hover:bg-slate-800/50 hover:text-white disabled:opacity-40"
      >
        <ArrowLeft className="h-4 w-4" />
        {prevLabel}
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-indigo-600 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : nextLabel}
          {!isLoading && <CheckCircle2 className="h-4 w-4" />}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-indigo-600 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {nextLabel}
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
