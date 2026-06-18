import { create } from 'zustand';
import { AssessmentState, AssessmentData } from '@/types/assessment';
import { trackEvent } from '@/lib/analytics';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'pathway_assessment_session';

const defaultData: AssessmentData = {
  educationLevel: '',
  stream: '',
  subjects: [],
  interests: [],
  hobbies: [],
  workStyle: {
    collaboration: 3,
    workplace: 3,
    structure: 3,
  },
  priorities: [],
  budget: '',
  additionalNotes: '',
};

// Cryptographically safe UUID v4 generator with math.random fallback
const generateUUID = (): string => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const useAssessmentStore = create<AssessmentState>((set, get) => {
  // Helper to save state to Supabase or localStorage
  const persistState = async (data: AssessmentData, step: number) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;

      if (user) {
        const { error } = await supabase.from('assessment_drafts').upsert(
          {
            user_id: user.id,
            current_step: step,
            selections: { ...data, sessionId: get().sessionId },
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

        if (error) {
          console.error(
            'Error saving assessment draft to Supabase:',
            error.message,
            `\nDetails: ${error.details}`,
            `\nHint: ${error.hint}`
          );
        }
      } else {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            data,
            currentStep: step,
            sessionId: get().sessionId,
            timestamp: new Date().toISOString(),
          })
        );
      }

      set({ isAutosaved: true });
      trackEvent('assessment_autosaved', { step, data });
      setTimeout(() => {
        set({ isAutosaved: false });
      }, 2000);
    } catch (error) {
      console.error('Error in persistState:', error);
    }
  };

  return {
    data: { ...defaultData },
    currentStep: 1,
    totalSteps: 9,
    isAutosaved: false,
    hasCachedSession: false,
    sessionId: null,
    userId: null,

    updateStepData: (newData) => {
      set((state) => {
        const updatedData = {
          ...state.data,
          ...newData,
        };
        // Auto-save on every state modification (runs in background)
        persistState(updatedData, state.currentStep);
        return { data: updatedData };
      });
    },

    nextStep: () => {
      const { currentStep, totalSteps, data } = get();
      if (currentStep < totalSteps) {
        const next = currentStep + 1;
        set({ currentStep: next });
        persistState(data, next);

        // Track step completion in background
        get().trackQuizEvent('step_completed', currentStep);

        trackEvent('step_completed', { step: currentStep });
        trackEvent('step_viewed', { step: next });
        return true;
      }
      return false;
    },

    prevStep: () => {
      const { currentStep, data } = get();
      if (currentStep > 1) {
        const prev = currentStep - 1;
        set({ currentStep: prev });
        persistState(data, prev);
        trackEvent('step_viewed', { step: prev });
      }
    },

    setStep: (step) => {
      const { totalSteps, data } = get();
      if (step >= 1 && step <= totalSteps) {
        set({ currentStep: step });
        persistState(data, step);
        trackEvent('step_viewed', { step });
      }
    },

    resetAssessment: async (shouldTrackStart = true) => {
      let userId: string | null = null;
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;

        if (user) {
          userId = user.id;
          const { error } = await supabase
            .from('assessment_drafts')
            .delete()
            .eq('user_id', user.id);

          if (error) {
            console.error('Error deleting draft from Supabase:', error);
          }
        }
      } catch (error) {
        console.error('Error deleting Supabase session in resetAssessment:', error);
      }

      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }

      const newSessionId = shouldTrackStart ? generateUUID() : null;

      set({
        data: { ...defaultData },
        currentStep: 1,
        hasCachedSession: false,
        sessionId: newSessionId,
        userId,
      });

      trackEvent('session_reset');

      if (shouldTrackStart) {
        await get().trackQuizEvent('started', 1);
        trackEvent('assessment_started', { step: 1 });
      }
    },

    loadCachedSession: async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;

        if (user) {
          const { data: draft, error } = await supabase
            .from('assessment_drafts')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error loading draft from Supabase:', error);
          }

          if (draft && draft.selections) {
            const restoredSessionId =
              ((draft.selections as Record<string, unknown>).sessionId as string) || generateUUID();
            // Clean payload by removing the injected sessionId
            const restoredData = { ...(draft.selections as Record<string, unknown>) };
            delete restoredData.sessionId;
            set({
              data: { ...defaultData, ...(restoredData as unknown as AssessmentData) },
              currentStep: draft.current_step || 1,
              sessionId: restoredSessionId,
              userId: user?.id || null,
              hasCachedSession: false,
            });
            trackEvent('session_resumed', {
              step: draft.current_step,
              data: restoredData,
            });
            return;
          }
        }

        // Fallback to guest / localStorage
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.data) {
            const restoredSessionId = parsed.sessionId || generateUUID();
            set({
              data: { ...defaultData, ...parsed.data },
              currentStep: parsed.currentStep || 1,
              sessionId: restoredSessionId,
              userId: null,
              hasCachedSession: false,
            });
            trackEvent('session_resumed', {
              step: parsed.currentStep,
              data: parsed.data,
            });
            return;
          }
        }
      } catch (error) {
        console.error('Error reading session cache in loadCachedSession:', error);
      }

      // Fallback if loading fails
      const newSessionId = generateUUID();
      set({ sessionId: newSessionId, userId: null, hasCachedSession: false });
      await get().trackQuizEvent('started', 1);
    },

    checkCachedSession: async () => {
      let userId: string | null = null;
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;

        if (user) {
          userId = user.id;
          const { data: draft, error } = await supabase
            .from('assessment_drafts')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error checking draft in Supabase:', error);
          }

          if (draft) {
            set({ hasCachedSession: true, userId: user.id });
            return;
          }
        }

        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.data) {
            set({ hasCachedSession: true, userId: null });
            return;
          }
        }
      } catch (error) {
        console.error('Error checking session cache in checkCachedSession:', error);
      }

      // No cached session: initialize a new session and track start
      const newSessionId = generateUUID();
      set({ sessionId: newSessionId, userId, hasCachedSession: false });
      await get().trackQuizEvent('started', 1);
      trackEvent('assessment_started', { step: 1 });
    },

    clearCacheStatus: () => {
      set({ hasCachedSession: false });
    },

    trackQuizEvent: async (eventType, stepNumber, metadata) => {
      try {
        const currentSessionId = get().sessionId;
        if (!currentSessionId) {
          console.warn('Skipping trackQuizEvent: sessionId is not initialized.');
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;

        const { error } = await supabase.from('assessment_events').insert({
          session_id: currentSessionId,
          user_id: user?.id || null,
          event_type: eventType,
          step_number: stepNumber ?? get().currentStep,
          metadata: metadata || {},
        });

        if (error) {
          console.error(
            `Failed to track quiz event '${eventType}':`,
            error.message,
            `\nDetails: ${error.details}`,
            `\nHint: ${error.hint}`
          );
        }
      } catch (err) {
        console.error('Error in trackQuizEvent:', err);
      }
    },
  };
});
