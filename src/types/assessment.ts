export type EducationLevel =
  | 'school_10th'
  | 'school_11th'
  | 'school_12th_pcm'
  | 'school_12th_pcb'
  | 'school_12th_commerce'
  | 'school_12th_arts'
  | 'graduate';

export type StreamType = 'pcm' | 'pcb' | 'commerce' | 'arts' | 'general' | 'undecided';

export interface WorkStyleData {
  collaboration: number; // 1 = Highly Independent, 5 = Highly Collaborative
  workplace: number; // 1 = Full Office/Desk, 5 = Full Field/Outdoor
  structure: number; // 1 = Rigidly Structured, 5 = Dynamic/Creative/Flexible
}

export interface AssessmentData {
  educationLevel: EducationLevel | '';
  stream: StreamType | '';
  subjects: string[];
  interests: string[];
  hobbies: string[];
  workStyle: WorkStyleData;
  priorities: string[];
  budget: string;
  additionalNotes: string;
}

export interface AssessmentState {
  data: AssessmentData;
  currentStep: number;
  totalSteps: number;
  isAutosaved: boolean;
  hasCachedSession: boolean;
  sessionId: string | null;
  userId: string | null;
  updateStepData: (newData: Partial<AssessmentData>) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetAssessment: (shouldTrackStart?: boolean) => Promise<void>;
  loadCachedSession: () => Promise<void>;
  checkCachedSession: () => Promise<void>;
  clearCacheStatus: () => void;
  trackQuizEvent: (
    eventType: 'started' | 'step_completed' | 'dropped' | 'finished',
    stepNumber?: number,
    metadata?: Record<string, unknown>
  ) => Promise<void>;
}
