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

// GET /api/colleges/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const client = getSupabaseClient();

    const { data: college, error } = await client
      .from('colleges')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!college) {
      return NextResponse.json({ success: false, error: 'College not found.' }, { status: 404 });
    }

    // Fetch specializations for courses offered
    const { data: specs } = await client
      .from('specializations')
      .select('specialization_name, seats_available, courses(id, name)')
      .eq('college_id', id);

    const fullData = {
      ...college,
      courses_offered: (specs || []).map((s) => ({
        specialization: s.specialization_name,
        seats: s.seats_available,
        course_id: s.courses ? (s.courses as any).id : null,
        course_name: s.courses ? (s.courses as any).name : 'Unknown Course',
      })),
    };

    return NextResponse.json({ success: true, data: fullData });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PUT /api/colleges/[id] (Admin Only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const updatePayload: any = {};
    if (name) updatePayload.name = name;
    if (location) updatePayload.location = location;
    if (state) updatePayload.state = state;
    if (ranking !== undefined) updatePayload.ranking = ranking ? Number(ranking) : null;
    if (fees_annual !== undefined) updatePayload.fees_annual = Number(fees_annual);
    if (admission_criteria) updatePayload.admission_criteria = admission_criteria;
    if (type) updatePayload.type = type;
    if (entrance_exams) updatePayload.entrance_exams = entrance_exams;
    if (website_url !== undefined) updatePayload.website_url = website_url;

    const client = getSupabaseClient();
    const { data: updatedCollege, error } = await client
      .from('colleges')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: updatedCollege });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE /api/colleges/[id] (Admin Only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrator privileges required.' },
        { status: 403 }
      );
    }

    const client = getSupabaseClient();
    const { error } = await client.from('colleges').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'College successfully deleted.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
