'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  stepNames?: string[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export function Stepper({
  currentStep,
  totalSteps,
  stepNames,
  onStepClick,
  className,
}: StepperProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile-only layout */}
      <div className="flex items-center justify-between pb-1 sm:hidden">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
            Step {currentStep} of {totalSteps}
          </span>
          {stepNames && stepNames[currentStep - 1] && (
            <h1 className="text-lg font-bold text-white">{stepNames[currentStep - 1]}</h1>
          )}
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden w-full items-center justify-between sm:flex">
        {steps.map((step) => {
          const isCompleted = step < currentStep;
          const isActive = step === currentStep;
          const isClickable = onStepClick && step <= currentStep; // Allow navigation to past steps

          return (
            <React.Fragment key={step}>
              {/* Stepper node */}
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => onStepClick?.(step)}
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 focus:outline-none',
                  isCompleted
                    ? 'border-indigo-500 bg-indigo-500 text-white'
                    : isActive
                      ? 'border-indigo-500 bg-slate-900 text-indigo-400 ring-4 ring-indigo-500/20'
                      : 'cursor-not-allowed border-slate-800 bg-slate-950 text-slate-500'
                )}
                aria-label={`Step ${step}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[3]" />
                ) : (
                  <span className="text-xs font-semibold">{step}</span>
                )}

                {/* Floating tooltip/label on hover */}
                {stepNames && stepNames[step - 1] && (
                  <span className="pointer-events-none absolute -bottom-6 left-1/2 hidden -translate-x-1/2 text-[9px] font-semibold whitespace-nowrap text-slate-400 transition-colors group-hover:text-white md:block">
                    {stepNames[step - 1]}
                  </span>
                )}
              </button>

              {/* Line connector between steps */}
              {step < totalSteps && (
                <div
                  className={cn(
                    'mx-2 h-0.5 flex-1 transition-all duration-500',
                    step < currentStep ? 'bg-indigo-500' : 'bg-slate-800'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
