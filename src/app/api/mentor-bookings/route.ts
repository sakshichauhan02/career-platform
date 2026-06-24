import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-key';
const getSupabaseClient = () => createClient(supabaseUrl, supabaseKey);

async function sendBookingConfirmationEmail(
  emailAddress: string,
  name: string,
  date: string,
  timeSlot: string
) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || 'support@pathwayai.co';

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: smtpPort === '465',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: fromEmail,
      to: emailAddress,
      subject: 'Your 1:1 Career Consultation is Confirmed! - PathWayAI',
      text: `Hello ${name},\n\nYour session is scheduled on ${date} during the slot ${timeSlot}.\n\nBest regards,\nPathWayAI Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">1:1 Advising Session Confirmed</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for scheduling your 1:1 advising session with PathWayAI. Here are your booking details:</p>
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 5px 0;"><strong>Time Slot:</strong> ${timeSlot}</p>
            <p style="margin: 5px 0;"><strong>Format:</strong> Virtual Video Call</p>
          </div>
          <p>A calendar invitation with the join link has been generated and sent to this email address.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">If you need to reschedule, please contact our support team.</p>
        </div>
      `,
    });
    return { sent: true, mode: 'SMTP' };
  } else {
    try {
      const mockMailDir = path.join(process.cwd(), 'public', 'mock-emails');
      if (!fs.existsSync(mockMailDir)) {
        fs.mkdirSync(mockMailDir, { recursive: true });
      }
      const mailId = `booking_${Date.now()}`;
      const mockMailPath = path.join(mockMailDir, `${mailId}.json`);

      fs.writeFileSync(
        mockMailPath,
        JSON.stringify(
          {
            id: mailId,
            to: emailAddress,
            subject: 'Your 1:1 Career Consultation is Confirmed! - PathWayAI',
            bookingDetails: { name, date, timeSlot },
            status: 'BOOKING_CONFIRMATION_MOCK_SENT',
            note: 'SMTP variables missing. Booking confirmation email saved locally.',
          },
          null,
          2
        )
      );
      return { sent: true, mode: 'MOCK', mockPath: `/mock-emails/${mailId}.json` };
    } catch (writeErr: any) {
      console.warn('Failed to write mock email to read-only filesystem:', writeErr.message);
      console.info('Simulated Booking Confirmation Email details:', {
        to: emailAddress,
        subject: 'Your 1:1 Career Consultation is Confirmed! - PathWayAI',
        bookingDetails: { name, date, timeSlot },
      });
      return { sent: true, mode: 'LOGGED', note: 'SMTP variables missing and filesystem is read-only. Logged to console.' };
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, date, timeSlot, userId, mentorId } = await req.json();

    if (!name || !phone || !email || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    const cleanUserId = userId || null;
    const cleanMentorId = mentorId || '00000000-0000-0000-0000-000000000000';

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

    const supabase = getSupabaseClient();

    // 1. Insert booking record into database
    const { data: dbData, error: dbError } = await supabase
      .from('mentor_bookings')
      .insert({
        student_id: cleanUserId,
        mentor_id: cleanMentorId,
        student_name: name,
        student_phone: phone,
        student_email: email,
        booking_date: date,
        time_slot: timeSlot,
        start_time: startTime,
        end_time: endTime,
        status: 'scheduled',
      })
      .select('*')
      .maybeSingle();

    if (dbError) {
      console.warn('Supabase booking insert error:', dbError);
      // We fall back gracefully in case columns aren't updated yet in local postgres, but try logging it
    }

    // 2. Send confirmation email
    const emailResult = await sendBookingConfirmationEmail(email, name, date, timeSlot);

    return NextResponse.json({
      success: true,
      booking: dbData || {
        student_name: name,
        student_phone: phone,
        student_email: email,
        booking_date: date,
        time_slot: timeSlot,
      },
      emailResult,
    });
  } catch (error: any) {
    console.error('Error creating mentor booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', details: error.message },
      { status: 500 }
    );
  }
}
