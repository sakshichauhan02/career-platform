import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder';

const getSupabaseClient = () => createClient(supabaseUrl, supabaseKey);

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return false;

  const token = authHeader.replace('Bearer ', '');
  const client = getSupabaseClient();

  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);
  if (error || !user) return false;

  const { data: profile } = await client
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  return !!(profile && profile.role === 'admin');
}

import { MOCK_COLLEGES } from './mockColleges';

// GET /api/colleges
export async function GET(req: NextRequest) {
  try {
    const client = getSupabaseClient();

    // Fetch all colleges
    const { data: colleges, error } = await client
      .from('colleges')
      .select('*')
      .order('ranking', { ascending: true });

    if (error) throw error;

    let finalColleges = [];

    if (colleges && colleges.length > 0) {
      // Fetch specializations mappings to include offered courses
      const { data: specs } = await client
        .from('specializations')
        .select('college_id, specialization_name, courses(name)');

      // Map courses offered to each college
      finalColleges = colleges.map((col) => {
        const colSpecs = (specs || []).filter((s) => s.college_id === col.id);
        return {
          ...col,
          courses_offered: colSpecs.map((s) => ({
            specialization: s.specialization_name,
            course_name: s.courses ? (s.courses as any).name : 'Unknown Course',
          })),
        };
      });
    } else {
      // Fallback to mock colleges if DB is empty
      finalColleges = MOCK_COLLEGES;
    }

    return NextResponse.json({ success: true, data: finalColleges });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST /api/colleges (Admin Only)
export async function POST(req: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator privileges required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      location,
      state,
      ranking,
      fees_annual,
      admission_criteria,
      type,
      entrance_exams,
      website_url,
    } = body;

    if (!name || !location || !state || fees_annual === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters.' },
        { status: 400 }
      );
    }

    const client = getSupabaseClient();
    const { data: newCollege, error } = await client
      .from('colleges')
      .insert({
        name,
        location,
        state,
        ranking: ranking ? Number(ranking) : null,
        fees_annual: Number(fees_annual),
        admission_criteria: admission_criteria || 'Merit Based',
        type: type || 'Government',
        entrance_exams: entrance_exams || [],
        website_url: website_url || null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: newCollege }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
