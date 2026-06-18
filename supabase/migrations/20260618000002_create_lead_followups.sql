-- Create public.lead_followups table to store lead follow-up status and notes
CREATE TABLE IF NOT EXISTS public.lead_followups (
    lead_id text PRIMARY KEY,
    status text NOT NULL DEFAULT 'New',
    notes text NOT NULL DEFAULT '',
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.lead_followups ENABLE ROW LEVEL SECURITY;

-- Allow public read/write since it is an admin tool
CREATE POLICY "Allow public read for lead_followups" ON public.lead_followups FOR SELECT USING (true);
CREATE POLICY "Allow public insert for lead_followups" ON public.lead_followups FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update for lead_followups" ON public.lead_followups FOR UPDATE USING (true);
