import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback to placeholder values to prevent createClient from crashing the dev server or SSR when env variables are not loaded yet
const validUrl = supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Warning: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
  );
}

export const supabase = createClient(validUrl, validKey);
