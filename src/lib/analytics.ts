type AnalyticsEvent =
  | 'assessment_started'
  | 'step_viewed'
  | 'step_completed'
  | 'session_resumed'
  | 'session_reset'
  | 'assessment_autosaved'
  | 'assessment_submitted'
  | 'mentor_booking_clicked'
  | 'mentor_redirected';

export const trackEvent = (event: AnalyticsEvent, properties?: Record<string, unknown>) => {
  // Console logging for verification. In production, this can be wired to Mixpanel, Google Analytics, Amplitude, etc.
  console.log(
    `%c[PathwayAI Analytics] %c${event}`,
    'color: #8b5cf6; font-weight: bold;',
    'color: #10b981; font-weight: 500;',
    properties || ''
  );
};
