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
import FollowUpStep from './FollowUpStep';
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

  // Calculate active quiz steps list dynamically (adaptive routing)
  const getActiveSteps = () => {
    const steps = [];

    // Step 1: Education Level (always present)
    steps.push({ id: 'education', name: 'Education Level' });

    // Step 2: Stream preference (only if not implicitly determined by 12th stream)
    const needsStreamStep =
      data.educationLevel === 'school_10th' ||
      data.educationLevel === 'school_11th' ||
      data.educationLevel === 'graduate' ||
      !data.educationLevel;
    if (needsStreamStep) {
      steps.push({ id: 'stream', name: 'Stream Preference' });
    }

    // Step 3: Subjects (always present)
    steps.push({ id: 'subjects', name: 'Favorite Subjects' });

    // Step 4: Interests (always present)
    steps.push({ id: 'interests', name: 'Key Interests' });

    // Step 4b (dynamic): Follow-up pathways focus (PCM/PCB/Commerce/Arts streams)
    const hasFollowUp =
      data.stream === 'pcm' ||
      data.stream === 'pcb' ||
      data.stream === 'commerce' ||
      data.stream === 'arts';
    if (hasFollowUp) {
      steps.push({ id: 'followup', name: 'Pathways Focus' });
    }

    // Step 5: Hobbies (always present)
    steps.push({ id: 'hobbies', name: 'Your Hobbies' });

    // Step 6: Work Style (always present)
    steps.push({ id: 'workstyle', name: 'Workplace Style' });

    // Step 7: Priorities (always present)
    steps.push({ id: 'priorities', name: 'Top Priorities' });

    // Step 8: Budget (always present)
    steps.push({ id: 'budget', name: 'Annual Budget' });

    // Step 9: Additional Notes (always present)
    steps.push({ id: 'notes', name: 'Goal Notes' });

    return steps;
  };

  const activeSteps = getActiveSteps();
  const totalStepsCount = activeSteps.length;
  const currentStepId = activeSteps[currentStep - 1]?.id;

  const handleNext = () => {
    setValidationError(null);
    let stepData: Record<string, unknown> = {};
    let schema;

    if (currentStepId === 'education') {
      schema = getStepSchema(1);
      stepData = { educationLevel: data.educationLevel };
    } else if (currentStepId === 'stream') {
      schema = getStepSchema(2);
      stepData = { stream: data.stream };
    } else if (currentStepId === 'subjects') {
      schema = getStepSchema(3);
      stepData = { subjects: data.subjects };
    } else if (currentStepId === 'interests') {
      schema = getStepSchema(4);
      stepData = { interests: data.interests };
    } else if (currentStepId === 'followup') {
      // Dynamic follow-up step does not require strict schema validation
    } else if (currentStepId === 'hobbies') {
      schema = getStepSchema(5);
      stepData = { hobbies: data.hobbies };
    } else if (currentStepId === 'workstyle') {
      schema = getStepSchema(6);
      stepData = { workStyle: data.workStyle };
    } else if (currentStepId === 'priorities') {
      schema = getStepSchema(7);
      stepData = { priorities: data.priorities };
    } else if (currentStepId === 'budget') {
      schema = getStepSchema(8);
      stepData = { budget: data.budget };
    } else if (currentStepId === 'notes') {
      schema = getStepSchema(9);
      stepData = { additionalNotes: data.additionalNotes };
    }

    if (schema) {
      const parseResult = schema.safeParse(stepData);
      if (!parseResult.success) {
        const errorMsg =
          parseResult.error.errors[0]?.message || 'Please complete the field to proceed.';
        setValidationError(errorMsg);
        return;
      }
    }

    if (currentStep < totalStepsCount) {
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

  const renderStep = () => {
    switch (currentStepId) {
      case 'education':
        return <EducationStep onSelect={handleNext} />;
      case 'stream':
        return <StreamStep onSelect={handleNext} />;
      case 'subjects':
        return <SubjectsStep />;
      case 'interests':
        return <InterestsStep />;
      case 'followup':
        return <FollowUpStep onSelect={handleNext} />;
      case 'hobbies':
        return <HobbiesStep />;
      case 'workstyle':
        return <WorkStyleStep />;
      case 'priorities':
        return <PrioritiesStep />;
      case 'budget':
        return <BudgetStep onSelect={handleNext} />;
      case 'notes':
        return <AdditionalNotesStep />;
      default:
        return null;
    }
  };

  // Percentage calculations
  const progressPercent = Math.round((currentStep / totalStepsCount) * 100);

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
        className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="flex flex-col items-center text-center">
          <div className="text-emerald-650 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Assessment Complete!
          </h2>
          <p className="text-slate-550 mt-2 text-sm leading-relaxed">
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
                    className="group hover:border-primary/20 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-left transition-all duration-300 hover:bg-white hover:shadow-sm"
                  >
                    {/* Header: Rank, Title, Score */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                          #{idx + 1}
                        </span>
                        <h4 className="group-hover:text-primary text-base font-bold text-slate-900 transition-colors">
                          {course.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-primary text-sm font-extrabold">{score}%</span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">
                          Match
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-1.5 w-full rounded-full bg-slate-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="bg-primary h-full rounded-full"
                      />
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600">
                      {course.description}
                    </p>

                    {/* Details Badges */}
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        <Clock className="h-3 w-3 text-slate-500" />
                        {course.durationYears} Years
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium ${
                          course.difficultyLevel === 'Advanced'
                            ? 'border border-rose-200 bg-rose-50 text-rose-700'
                            : course.difficultyLevel === 'Intermediate'
                              ? 'border-amber-250 border bg-amber-50 text-amber-700'
                              : 'border-emerald-250 border bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        <Award className="h-3 w-3" />
                        {course.difficultyLevel}
                      </span>
                    </div>

                    {/* Matching criteria checklist */}
                    {matchReasons && matchReasons.length > 0 && (
                      <div className="border-slate-150 mt-3 border-t pt-3">
                        <span className="mb-1.5 block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                          Why It Matches You
                        </span>
                        <ul className="space-y-1">
                          {matchReasons.slice(0, 3).map((reason: string, rIdx: number) => (
                            <li
                              key={rIdx}
                              className="text-primary flex items-start gap-1.5 text-[10px] leading-relaxed"
                            >
                              <Compass className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
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
                        className="text-primary hover:text-primary/80 flex items-center gap-1 text-[10px] font-bold transition-colors"
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
                          className="overflow-hidden border-t border-slate-100 pt-4"
                        >
                          <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                            {/* Why it fits */}
                            <div className="space-y-1">
                              <span className="text-primary flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase">
                                <Sparkles className="text-primary h-3.5 w-3.5" />
                                Why This Course Fits
                              </span>
                              <p className="text-[11px] leading-relaxed text-slate-600">
                                {item.explanation.whyThisCourseFits}
                              </p>
                            </div>

                            {/* Strength Analysis */}
                            <div className="space-y-1">
                              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-emerald-600 uppercase">
                                <Brain className="h-3.5 w-3.5 text-emerald-600" />
                                Strength Analysis
                              </span>
                              <p className="text-[11px] leading-relaxed text-slate-600">
                                {item.explanation.strengthAnalysis}
                              </p>
                            </div>

                            {/* Interest Analysis */}
                            <div className="space-y-1">
                              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-amber-600 uppercase">
                                <BookOpen className="h-3.5 w-3.5 text-amber-600" />
                                Interest Analysis
                              </span>
                              <p className="text-[11px] leading-relaxed text-slate-600">
                                {item.explanation.interestAnalysis}
                              </p>
                            </div>

                            {/* Career Fit Analysis */}
                            <div className="space-y-1">
                              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-rose-600 uppercase">
                                <Briefcase className="h-3.5 w-3.5 text-rose-600" />
                                Career Fit Analysis
                              </span>
                              <p className="text-[11px] leading-relaxed text-slate-600">
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
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center">
              <HelpCircle className="mx-auto h-8 w-8 animate-pulse text-slate-400" />
              <p className="mt-2 text-xs text-slate-500">Calculating matches...</p>
            </div>
          )}
        </div>

        {/* Global report banner */}
        <div className="border-primary/20 bg-primary/5 mt-6 flex items-start gap-3 rounded-xl border p-4 text-left">
          <Sparkles className="text-primary mt-0.5 h-5 w-5 shrink-0 animate-pulse" />
          <div>
            <h5 className="text-primary animate-pulse text-xs font-bold">
              Detailed Report Available
            </h5>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
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
            className="flex items-center gap-1.5 rounded-full border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Assessment
          </Button>
          <Link href="/courses" passHref>
            <Button className="bg-primary hover:bg-primary/90 w-full rounded-full text-white sm:w-auto">
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
            className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-white/95 p-6 text-center shadow-xl backdrop-blur-sm"
          >
            <div className="max-w-md space-y-6">
              <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <Save className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Resume previous session?</h3>
                <p className="text-slate-650 text-xs leading-relaxed">
                  We found an unfinished assessment saved in your browser storage. Would you like to
                  resume from where you left off or start fresh?
                </p>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
                <Button
                  onClick={() => loadCachedSession()}
                  className="bg-primary hover:bg-primary/90 rounded-full text-white"
                >
                  Resume Assessment
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => resetAssessment()}
                  className="hover:bg-slate-550 rounded-full text-slate-500 hover:text-slate-950"
                >
                  Start Fresh
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main card */}
      <div className="border-border space-y-6 rounded-3xl border bg-white p-6 shadow-xl md:p-8">
        {/* Step progress heading */}
        <div className="border-border flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <Stepper
            currentStep={currentStep}
            totalSteps={totalStepsCount}
            stepNames={activeSteps.map((s) => s.name)}
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
                  className="inline-flex animate-pulse items-center gap-1 rounded border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600"
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
              className="mt-4 text-center text-xs font-semibold text-red-500"
            >
              {validationError}
            </motion.p>
          )}
        </div>

        {/* Actions bar footer */}
        <NavigationButtons
          onPrev={handlePrev}
          onNext={currentStep === totalStepsCount ? handleSubmit : handleNext}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === totalStepsCount}
          nextLabel={currentStep === totalStepsCount ? 'Submit Assessment' : 'Next'}
          isLoading={isSubmitting}
          className="border-border mt-4 border-t pt-4"
        />
      </div>
    </div>
  );
}
