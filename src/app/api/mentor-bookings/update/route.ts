import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-key';
const getSupabaseClient = () => createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { bookingId, status, mentorId, date, timeSlot } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const updateData: Record<string, any> = {};

    if (status) {
      updateData.status = status;
    }

    if (mentorId) {
      updateData.mentor_id = mentorId;
    }

    if (date && timeSlot) {
      let startTime: string;
      let endTime: string;

      try {
        const parsedStart = new Date(`${date} ${timeSlot}`);
        if (isNaN(parsedStart.getTime())) {
          throw new Error('Invalid date/time');
        }
        startTime = parsedStart.toISOString();
        endTime = new Date(parsedStart.getTime() + 30 * 60 * 1000).toISOString();
      } catch (e) {
        let fallbackDate = new Date(date);
        if (isNaN(fallbackDate.getTime())) {
          fallbackDate = new Date();
        }
        startTime = fallbackDate.toISOString();
        endTime = new Date(fallbackDate.getTime() + 30 * 60 * 1000).toISOString();
      }

      updateData.booking_date = date;
      updateData.time_slot = timeSlot;
      updateData.start_time = startTime;
      updateData.end_time = endTime;
    }

    const { data, error } = await supabase
      .from('mentor_bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error updating booking in Supabase:', error);
      return NextResponse.json(
        { error: 'Database update failed', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: data,
    });
  } catch (error: any) {
    console.error('Error processing booking update:', error);
    return NextResponse.json(
      { error: 'Update request failed', details: error.message },
      { status: 500 }
    );
  }
}
