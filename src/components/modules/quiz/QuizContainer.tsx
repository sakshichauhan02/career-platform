'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  RotateCcw,
  Save,
  Sparkles,
  Award,
  Clock,
  Compass,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Brain,
  Briefcase,
  BookOpen,
} from 'lucide-react';
import { ScoredCourse } from '@/services/recommendationEngine';
import { useAssessmentStore } from '@/store/useAssessmentStore';
import { getStepSchema } from '@/schemas/assessment';
import { trackEvent } from '@/lib/analytics';
import { supabaseUrl, supabaseAnonKey } from '@/lib/supabase';
import EducationStep from './EducationStep';
import StreamStep from './StreamStep';
import SubjectsStep from './SubjectsStep';
import InterestsStep from './InterestsStep';
import HobbiesStep from './HobbiesStep';
import WorkStyleStep from './WorkStyleStep';
import PrioritiesStep from './PrioritiesStep';
import BudgetStep from './BudgetStep';
import AdditionalNotesStep from './AdditionalNotesStep';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { ProgressBar } from '@/components/ui/progress-bar';
import { NavigationButtons } from '@/components/ui/navigation-buttons';

export function QuizContainer() {
  const router = useRouter();
  const {
    data,
    currentStep,
    totalSteps,
    isAutosaved,
    hasCachedSession,
    nextStep,
    prevStep,
    resetAssessment,
    loadCachedSession,
    checkCachedSession,
    setStep,
    trackQuizEvent,
  } = useAssessmentStore();

  const [validationError, setValidationError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ScoredCourse[]>([]);
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [direction, setDirection] = useState(0); // -1 for back, 1 for next
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for cached session on mount
  useEffect(() => {
    const initSession = async () => {
      await checkCachedSession();
      // Only track start if there's no cached session to resume
      const state = useAssessmentStore.getState();
      if (!state.hasCachedSession) {
        trackEvent('assessment_started', { step: 1 });
      }
    };
    initSession();
  }, [checkCachedSession]);

  // Track dropped session on unload/pagehide
  useEffect(() => {
    const handleUnload = () => {
      const storeState = useAssessmentStore.getState();
      const currentSessionId = storeState.sessionId;
      const currentUserId = storeState.userId;
      const step = storeState.currentStep;

      // Only track if the user has a valid active session and has interacted with the quiz
      const hasAnsweredSomething =
        storeState.data.educationLevel !== '' ||
        storeState.data.stream !== '' ||
        storeState.data.subjects.length > 0;

      if (currentSessionId && hasAnsweredSomething && !isSubmitted && !isSubmitting) {
        const payload = {
          session_id: currentSessionId,
          user_id: currentUserId,
          event_type: 'dropped',
          step_number: step,
          metadata: {
            educationLevel: storeState.data.educationLevel,
            stream: storeState.data.stream,
            completedStepCount: step,
          },
        };

        const url = `${supabaseUrl}/rest/v1/assessment_events`;
        const headers = {
          'Content-Type': 'application/json',
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          Prefer: 'return=minimal',
        };

        fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          keepalive: true,
        });
      }
    };

    window.addEventListener('pagehide', handleUnload);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('pagehide', handleUnload);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [isSubmitted, isSubmitting]);

  const handleNext = () => {
    setValidationError(null);
    const schema = getStepSchema(currentStep);

    // Validate current step answers
    let stepData: Record<string, unknown> = {};
    if (currentStep === 1) stepData = { educationLevel: data.educationLevel };
    else if (currentStep === 2) stepData = { stream: data.stream };
    else if (currentStep === 3) stepData = { subjects: data.subjects };
    else if (currentStep === 4) stepData = { interests: data.interests };
    else if (currentStep === 5) stepData = { hobbies: data.hobbies };
    else if (currentStep === 6) stepData = { workStyle: data.workStyle };
    else if (currentStep === 7) stepData = { priorities: data.priorities };
    else if (currentStep === 8) stepData = { budget: data.budget };
    else if (currentStep === 9) stepData = { additionalNotes: data.additionalNotes };

    const parseResult = schema.safeParse(stepData);

    if (!parseResult.success) {
      const errorMsg =
        parseResult.error.errors[0]?.message || 'Please complete the field to proceed.';
      setValidationError(errorMsg);
      return;
    }

    if (currentStep < totalSteps) {
      setDirection(1);
      nextStep();
    }
  };

  const handlePrev = () => {
    setValidationError(null);
    setDirection(-1);
    prevStep();
  };

  const handleSubmit = async () => {
    setValidationError(null);
    const schema = getStepSchema(9);
    const parseResult = schema.safeParse({ additionalNotes: data.additionalNotes });

    if (!parseResult.success) {
      setValidationError(parseResult.error.errors[0]?.message || 'Validation failed.');
      return;
    }

    setIsSubmitting(true);
    trackEvent('assessment_submitted', { finalData: data });

    // Log the finished event in Supabase in background
    await trackQuizEvent('finished', totalSteps, { finalData: data });

    try {
      const storeState = useAssessmentStore.getState();
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          userId: storeState.userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const resData = await response.json();
      if (resData.success) {
        setRecommendations(resData.recommendations);
        localStorage.setItem(
          'pathway_latest_results',
          JSON.stringify({
            recommendations: resData.recommendations,
            profile: data,
            submittedAt: new Date().toISOString(),
          })
        );
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Clean up the draft from both Supabase and localStorage after successful submit (do not track start)
      await resetAssessment(false);
      // Redirect to the new dedicated Results page
      router.push('/results');
    }
  };

  const stepNames = [
    'Education Level',
    'Stream Preference',
    'Favorite Subjects',
    'Key Interests',
    'Your Hobbies',
    'Workplace Style',
    'Top Priorities',
    'Annual Budget',
    'Goal Notes',
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EducationStep />;
      case 2:
        return <StreamStep />;
      case 3:
        return <SubjectsStep />;
      case 4:
        return <InterestsStep />;
      case 5:
        return <HobbiesStep />;
      case 6:
        return <WorkStyleStep />;
      case 7:
        return <PrioritiesStep />;
      case 8:
        return <BudgetStep />;
      case 9:
        return <AdditionalNotesStep />;
      default:
        return null;
    }
  };

  // Percentage calculations
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  // Animate slide settings
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md md:p-8"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
            Assessment Complete!
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            We analyzed your stream, interests, hobbies, work style, and career priorities. Here are
            your top matches:
          </p>
        </div>

        {/* Top 5 Courses List */}
        <div className="mt-8 space-y-4">
          <h3 className="text-left text-xs font-bold tracking-wider text-slate-500 uppercase">
            Top 5 Recommended Courses
          </h3>

          {recommendations && recommendations.length > 0 ? (
            <motion.div
              className="space-y-4"
              variants={{
                show: { transition: { staggerChildren: 0.08 } },
              }}
              initial="hidden"
              animate="show"
            >
              {recommendations.map((item, idx) => {
                const { course, score, matchReasons } = item;
                return (
                  <motion.div
                    key={course.id}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0 },
                    }}
                    className="group rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-left transition-all duration-300 hover:border-slate-700/80 hover:bg-slate-900/30"
                  >
                    {/* Header: Rank, Title, Score */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-300">
                          #{idx + 1}
                        </span>
                        <h4 className="text-base font-bold text-white transition-colors group-hover:text-indigo-400">
                          {course.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-extrabold text-indigo-400">{score}%</span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">
                          Match
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      />
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-400">
                      {course.description}
                    </p>

                    {/* Details Badges */}
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                        <Clock className="h-3 w-3 text-slate-500" />
                        {course.durationYears} Years
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium ${
                          course.difficultyLevel === 'Advanced'
                            ? 'border border-rose-500/20 bg-rose-500/10 text-rose-400'
                            : course.difficultyLevel === 'Intermediate'
                              ? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                              : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        <Award className="h-3 w-3" />
                        {course.difficultyLevel}
                      </span>
                    </div>

                    {/* Matching criteria checklist */}
                    {matchReasons && matchReasons.length > 0 && (
                      <div className="mt-3 border-t border-slate-800/60 pt-3">
                        <span className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                          Why It Matches You
                        </span>
                        <ul className="space-y-1">
                          {matchReasons.slice(0, 3).map((reason: string, rIdx: number) => (
                            <li
                              key={rIdx}
                              className="flex items-start gap-1.5 text-[10px] leading-relaxed text-indigo-300"
                            >
                              <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-500" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Collapsible toggle button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() =>
                          setExpandedCourseId(expandedCourseId === course.id ? null : course.id)
                        }
                        className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 transition-colors hover:text-indigo-300"
                      >
                        {expandedCourseId === course.id ? (
                          <>
                            <span>Hide Detailed Fit</span>
                            <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            <span>View Detailed Fit</span>
                            <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Collapsible explanation panel using framer-motion */}
                    <AnimatePresence initial={false}>
                      {expandedCourseId === course.id && item.explanation && (
                        <motion.div
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            open: { opacity: 1, height: 'auto', marginTop: 16 },
                            collapsed: { opacity: 0, height: 0, marginTop: 0 },
                          }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden border-t border-slate-800/80 pt-4"
                        >
                          <div className="space-y-4 rounded-lg border border-slate-800/40 bg-slate-950/60 p-4">
                            {/* Why it fits */}
                            <div className="space-y-1">
                              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
                                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                                Why This Course Fits
                              </span>
                              <p className="text-[11px] leading-relaxed text-slate-300">
                                {item.explanation.whyThisCourseFits}
                              </p>
                            </div>

                            {/* Strength Analysis */}
                            <div className="space-y-1">
                              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-teal-400 uppercase">
                                <Brain className="h-3.5 w-3.5 text-teal-500" />
                                Strength Analysis
                              </span>
                              <p className="text-[11px] leading-relaxed text-slate-300">
                                {item.explanation.strengthAnalysis}
                              </p>
                            </div>

                            {/* Interest Analysis */}
                            <div className="space-y-1">
                              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                                <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                                Interest Analysis
                              </span>
                              <p className="text-[11px] leading-relaxed text-slate-300">
                                {item.explanation.interestAnalysis}
                              </p>
                            </div>

                            {/* Career Fit Analysis */}
                            <div className="space-y-1">
                              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-rose-400 uppercase">
                                <Briefcase className="h-3.5 w-3.5 text-rose-500" />
                                Career Fit Analysis
                              </span>
                              <p className="text-[11px] leading-relaxed text-slate-300">
                                {item.explanation.careerFitAnalysis}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/20 py-8 text-center">
              <HelpCircle className="mx-auto h-8 w-8 animate-pulse text-slate-600" />
              <p className="mt-2 text-xs text-slate-500">Calculating matches...</p>
            </div>
          )}
        </div>

        {/* Global report banner */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4 text-left">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 animate-pulse text-indigo-400" />
          <div>
            <h5 className="text-xs font-bold text-indigo-300">Detailed Report Available</h5>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
              Your comprehensive Career Discovery report has been compiled and is ready for download
              in your dashboard.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setRecommendations([]);
              resetAssessment();
            }}
            variant="outline"
            className="flex items-center gap-1.5 border-slate-800 text-slate-300 hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Assessment
          </Button>
          <Link href="/courses" passHref>
            <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto">
              Browse Careers & Courses
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl">
      {/* Session Resume dialog */}
      <AnimatePresence>
        {hasCachedSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-slate-950/90 p-6 text-center backdrop-blur-sm"
          >
            <div className="max-w-md space-y-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                <Save className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Resume previous session?</h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  We found an unfinished assessment saved in your browser storage. Would you like to
                  resume from where you left off or start fresh?
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                <Button
                  onClick={() => loadCachedSession()}
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Resume Assessment
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => resetAssessment()}
                  className="text-slate-400 hover:bg-slate-900 hover:text-white"
                >
                  Start Fresh
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main card */}
      <div className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md md:p-8">
        {/* Step progress heading */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <Stepper
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepNames={stepNames}
            onStepClick={setStep}
            className="min-w-[200px] flex-1"
          />

          {/* Autosaved alert badge */}
          <div className="flex h-8 shrink-0 items-center gap-1.5">
            <AnimatePresence>
              {isAutosaved && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="inline-flex animate-pulse items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400"
                >
                  <Save className="h-3 w-3" />
                  Autosaved
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar value={progressPercent} />

        {/* Form area wrapped in Framer Motion */}
        <div className="flex min-h-[350px] flex-col justify-between py-2">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Validation Error Alerts */}
          {validationError && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-xs font-semibold text-rose-400"
            >
              {validationError}
            </motion.p>
          )}
        </div>

        {/* Actions bar footer */}
        <NavigationButtons
          onPrev={handlePrev}
          onNext={currentStep === totalSteps ? handleSubmit : handleNext}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === totalSteps}
          nextLabel={currentStep === totalSteps ? 'Submit Assessment' : 'Next'}
          isLoading={isSubmitting}
          className="mt-4 border-t border-slate-800/80 pt-4"
        />
      </div>
    </div>
  );
}
