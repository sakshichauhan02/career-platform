-- Create Assessment Drafts Table for autosave functionality
CREATE TABLE IF NOT EXISTS public.assessment_drafts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_step integer NOT NULL DEFAULT 1,
    selections jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.assessment_drafts ENABLE ROW LEVEL SECURITY;

-- Policies to allow only the draft owners to read, write, update, and delete their own drafts
CREATE POLICY "Users can manage their own assessment drafts" 
    ON public.assessment_drafts
    FOR ALL 
    USING (auth.uid() = user_id);
