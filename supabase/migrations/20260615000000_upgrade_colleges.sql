-- Upgrade Colleges Table
ALTER TABLE public.colleges 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'Government' CHECK (type IN ('Government', 'Private')),
ADD COLUMN IF NOT EXISTS entrance_exams text[] DEFAULT '{}'::text[];

-- Update RLS Policies for colleges just in case
-- Public select is already allowed, admin manage is already allowed.
