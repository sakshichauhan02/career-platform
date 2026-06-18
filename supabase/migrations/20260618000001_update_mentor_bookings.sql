-- Allow student_id to be NULL for guest bookings
ALTER TABLE public.mentor_bookings 
ALTER COLUMN student_id DROP NOT NULL;

-- Add contact columns for guest bookings
ALTER TABLE public.mentor_bookings 
ADD COLUMN IF NOT EXISTS student_name text,
ADD COLUMN IF NOT EXISTS student_phone text,
ADD COLUMN IF NOT EXISTS student_email text,
ADD COLUMN IF NOT EXISTS booking_date date,
ADD COLUMN IF NOT EXISTS time_slot text;
