-- Add aishe_code to colleges table
ALTER TABLE public.colleges 
ADD COLUMN IF NOT EXISTS aishe_code text UNIQUE;
