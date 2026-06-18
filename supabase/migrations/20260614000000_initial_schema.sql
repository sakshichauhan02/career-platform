-- Enable database extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create Custom ENUM Types
CREATE TYPE public.user_role AS ENUM ('student', 'admin', 'mentor');
CREATE TYPE public.billing_status AS ENUM ('pending', 'success', 'failed');
CREATE TYPE public.booking_status AS ENUM ('scheduled', 'completed', 'cancelled');

-- ---------------------------------------------------------
-- TABLES DEFINITION
-- ---------------------------------------------------------

-- 1. Profiles (linked to auth.users)
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    full_name text,
    avatar_url text,
    role public.user_role DEFAULT 'student'::public.user_role NOT NULL,
    class_level integer CHECK (class_level IN (10, 11, 12)),
    academic_stream text,
    tier text DEFAULT 'free'::text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Assessment Responses
CREATE TABLE public.assessment_responses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    responses jsonb NOT NULL,
    completed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Recommendations
CREATE TABLE public.recommendations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    career_title text NOT NULL,
    match_score numeric(5,2) NOT NULL CHECK (match_score >= 0.00 AND match_score <= 100.00),
    reasoning text NOT NULL,
    recommended_paths text[] NOT NULL,
    embedding public.vector(1536), -- supporting 1536-dimensional embeddings (e.g. OpenAI text-embedding-3-small)
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Courses
CREATE TABLE public.courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    description text NOT NULL,
    duration_years integer NOT NULL CHECK (duration_years > 0),
    difficulty_level text CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Course Tags (Normalized relation for filtering)
CREATE TABLE public.course_tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    tag text NOT NULL,
    UNIQUE(course_id, tag)
);

-- 6. Colleges
CREATE TABLE public.colleges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    location text NOT NULL,
    state text NOT NULL,
    ranking integer CHECK (ranking > 0),
    fees_annual integer NOT NULL CHECK (fees_annual >= 0),
    admission_criteria text NOT NULL,
    website_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. College Specializations (Degrees offered by Colleges mapping to Core Courses)
CREATE TABLE public.specializations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    specialization_name text NOT NULL,
    seats_available integer NOT NULL CHECK (seats_available >= 0),
    UNIQUE(college_id, course_id, specialization_name)
);

-- 8. Payments
CREATE TABLE public.payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    order_id text UNIQUE NOT NULL,
    payment_id text UNIQUE,
    signature text,
    amount numeric(10,2) NOT NULL CHECK (amount >= 0.00),
    status public.billing_status DEFAULT 'pending'::public.billing_status NOT NULL,
    product_name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Mentor Bookings
CREATE TABLE public.mentor_bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    status public.booking_status DEFAULT 'scheduled'::public.booking_status NOT NULL,
    meeting_link text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT slot_chronology CHECK (end_time > start_time),
    CONSTRAINT booking_duration CHECK (end_time - start_time <= INTERVAL '2 hours')
);

-- 10. Report Downloads
CREATE TABLE public.report_downloads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_path text NOT NULL,
    download_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Audit Logs
CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    action text NOT NULL,
    table_name text NOT NULL,
    row_id uuid NOT NULL,
    payload jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ---------------------------------------------------------
-- INDEXING FOR SCALE
-- ---------------------------------------------------------

-- GIN Trigram Indexes for Fuzzy/Semantic Searches over large datasets (10k+ colleges / 500+ courses)
CREATE INDEX IF NOT EXISTS idx_colleges_name_trgm ON public.colleges USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_colleges_location_trgm ON public.colleges USING gin (location gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_courses_name_trgm ON public.courses USING gin (name gin_trgm_ops);

-- B-Tree Indexes for Foreign Keys & Join Operations
CREATE INDEX IF NOT EXISTS idx_assessment_responses_user_id ON public.assessment_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON public.recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_course_tags_course_id ON public.course_tags(course_id);
CREATE INDEX IF NOT EXISTS idx_specializations_college_id ON public.specializations(college_id);
CREATE INDEX IF NOT EXISTS idx_specializations_course_id ON public.specializations(course_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_bookings_student_id ON public.mentor_bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_mentor_bookings_mentor_id ON public.mentor_bookings(mentor_id);
CREATE INDEX IF NOT EXISTS idx_report_downloads_user_id ON public.report_downloads(user_id);

-- Composite Index for Scheduling & Double-Booking prevention checks
CREATE INDEX IF NOT EXISTS idx_bookings_mentor_time ON public.mentor_bookings(mentor_id, start_time, end_time);

-- ---------------------------------------------------------
-- CONCURRENCY LUNCHTIME / PREVENT DOUBLE BOOKING CONSTRAINT
-- ---------------------------------------------------------

-- Custom SQL function to check slot overlaps during booking creation
CREATE OR REPLACE FUNCTION public.check_mentor_overlap() 
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM public.mentor_bookings
        WHERE mentor_id = NEW.mentor_id
          AND status = 'scheduled'::public.booking_status
          AND id <> NEW.id
          AND tstzrange(start_time, end_time) && tstzrange(NEW.start_time, NEW.end_time)
    ) THEN
        RAISE EXCEPTION 'This time slot is already booked for this mentor.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_double_booking
BEFORE INSERT OR UPDATE ON public.mentor_bookings
FOR EACH ROW EXECUTE FUNCTION public.check_mentor_overlap();

-- ---------------------------------------------------------
-- DB AUTOMATIC TRIGGERS
-- ---------------------------------------------------------

-- Function to handle auto-updating `updated_at` column
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER handle_updated_at_payments BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Function to automatically create a public profile entry when a new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role, tier)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
        'student'::public.user_role,
        'free'::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ---------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Allow users to read their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow admins full access to profiles" ON public.profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
        )
    );

-- 2. Assessment Responses Policies
CREATE POLICY "Users can insert their own responses" ON public.assessment_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own responses" ON public.assessment_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view assessment responses" ON public.assessment_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
        )
    );

-- 3. Recommendations Policies
CREATE POLICY "Users can read their own recommendations" ON public.recommendations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view/manage recommendations" ON public.recommendations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
        )
    );

-- 4. Courses & Course Tags Policies (Public Read, Admin Write)
CREATE POLICY "Allow public select on courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow admin manage courses" ON public.courses FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
    )
);

CREATE POLICY "Allow public select on course_tags" ON public.course_tags FOR SELECT USING (true);
CREATE POLICY "Allow admin manage course_tags" ON public.course_tags FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
    )
);

-- 5. Colleges & Specializations Policies (Public Read, Admin Write)
CREATE POLICY "Allow public select on colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Allow admin manage colleges" ON public.colleges FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
    )
);

CREATE POLICY "Allow public select on specializations" ON public.specializations FOR SELECT USING (true);
CREATE POLICY "Allow admin manage specializations" ON public.specializations FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
    )
);

-- 6. Payments Policies
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System Webhook insertion permitted" ON public.payments
    FOR INSERT WITH CHECK (true); -- insertions are allowed, updates restricted to admin contexts

CREATE POLICY "Admins can view payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
        )
    );

-- 7. Mentor Bookings Policies
CREATE POLICY "Students can read their own bookings" ON public.mentor_bookings
    FOR SELECT USING (auth.uid() = student_id OR auth.uid() = mentor_id);

CREATE POLICY "Students can create bookings" ON public.mentor_bookings
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students/Mentors can update bookings" ON public.mentor_bookings
    FOR UPDATE USING (auth.uid() = student_id OR auth.uid() = mentor_id);

CREATE POLICY "Admins can manage bookings" ON public.mentor_bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
        )
    );

-- 8. Report Downloads Policies
CREATE POLICY "Users can select their own report downloads" ON public.report_downloads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can track their report downloads" ON public.report_downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view report downloads" ON public.report_downloads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
        )
    );

-- 9. Audit Logs Policies (Strictly Admin Access)
CREATE POLICY "Only admins can select audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
        )
    );

CREATE POLICY "Only admins/system triggers can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'::public.user_role
        ) OR auth.uid() IS NULL -- allows database triggers to write logs
    );
