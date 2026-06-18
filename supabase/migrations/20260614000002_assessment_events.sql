-- Create enum for event types if not exists
DO $$ BEGIN
    CREATE TYPE public.quiz_event_type AS ENUM ('started', 'step_completed', 'dropped', 'finished');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Assessment Events Table
CREATE TABLE IF NOT EXISTS public.assessment_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    event_type public.quiz_event_type NOT NULL,
    step_number integer,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.assessment_events ENABLE ROW LEVEL SECURITY;

-- Allow public insert to assessment_events (since guests and authenticated users submit events)
CREATE POLICY "Allow public insert to assessment_events" 
    ON public.assessment_events
    FOR INSERT 
    WITH CHECK (true);

-- Allow reading events only by authenticated admins
CREATE POLICY "Allow admin read access to assessment_events" 
    ON public.assessment_events
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
        )
    );

-- Add index on session_id and user_id for fast analytics querying
CREATE INDEX IF NOT EXISTS idx_assessment_events_session_id ON public.assessment_events(session_id);
CREATE INDEX IF NOT EXISTS idx_assessment_events_user_id ON public.assessment_events(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_events_event_type ON public.assessment_events(event_type);
