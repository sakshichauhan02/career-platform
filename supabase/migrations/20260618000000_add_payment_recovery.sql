-- Add recovery tracking columns to payments table
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS is_recovered boolean DEFAULT false NOT NULL;

ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS reminder_sent_count integer DEFAULT 0 NOT NULL;
