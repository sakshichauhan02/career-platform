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

async function sendRecoveryEmail(
  emailAddress: string,
  productName: string,
  amount: number,
  orderId: string,
  studentName: string
) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.FROM_EMAIL || 'billing@pathwayai.co';

  const recoveryLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/results?recover_order=${orderId}`;

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
      subject: `Complete your checkout for ${productName} - PathWayAI`,
      text: `Hello ${studentName},\n\nWe noticed your payment for ${productName} was not completed. You can complete it here: ${recoveryLink}\n\nBest regards,\nPathWayAI Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Don't miss out on your premium career insights!</h2>
          <p>Hello <strong>${studentName}</strong>,</p>
          <p>We noticed that your transaction of <strong>₹${amount}</strong> for the <strong>${productName}</strong> was not completed successfully.</p>
          <p>You can easily resume your transaction and unlock your access using the button below:</p>
          <div style="margin: 25px 0; text-align: center;">
            <a href="${recoveryLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Complete Payment Now</a>
          </div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">If you need assistance, please reply to this email.</p>
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
      const mailId = `recovery_${Date.now()}`;
      const mockMailPath = path.join(mockMailDir, `${mailId}.json`);

      fs.writeFileSync(
        mockMailPath,
        JSON.stringify(
          {
            id: mailId,
            to: emailAddress,
            subject: `Complete your checkout for ${productName} - PathWayAI`,
            recoveryLink,
            status: 'RECOVERY_REMINDER_MOCK_SENT',
            note: 'SMTP variables missing in .env.local. Simulated recovery reminder email saved locally.',
          },
          null,
          2
        )
      );
      return { sent: true, mode: 'MOCK', mockPath: `/mock-emails/${mailId}.json` };
    } catch (writeErr: any) {
      console.warn('Failed to write mock email to read-only filesystem:', writeErr.message);
      console.info('Simulated Recovery Email details:', {
        to: emailAddress,
        subject: `Complete your checkout for ${productName} - PathWayAI`,
        recoveryLink,
      });
      return { sent: true, mode: 'LOGGED', note: 'SMTP variables missing and filesystem is read-only. Logged to console.' };
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    // 1. Fetch pending (>15 mins old) or failed payments that are not yet recovered and reminder count < 3
    const { data: unpaidPayments, error: fetchErr } = await supabase
      .from('payments')
      .select('*, profiles(email, full_name)')
      .or('status.eq.failed,status.eq.pending')
      .lt('created_at', fifteenMinutesAgo)
      .eq('is_recovered', false)
      .lt('reminder_sent_count', 3);

    if (fetchErr) {
      throw fetchErr;
    }

    const results = [];

    // 2. Loop and send recovery emails
    if (unpaidPayments && unpaidPayments.length > 0) {
      for (const payment of unpaidPayments) {
        const email = payment.profiles?.email;
        const name = payment.profiles?.full_name || 'Student';

        if (email) {
          const emailRes = await sendRecoveryEmail(
            email,
            payment.product_name,
            payment.amount,
            payment.order_id,
            name
          );

          // Update reminder sent count
          await supabase
            .from('payments')
            .update({
              reminder_sent_count: (payment.reminder_sent_count || 0) + 1,
              updated_at: new Date().toISOString(),
            })
            .eq('id', payment.id);

          results.push({
            paymentId: payment.id,
            email,
            status: 'sent',
            emailRes,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: unpaidPayments?.length || 0,
      remindersSent: results,
    });
  } catch (error: any) {
    console.error('Error running payment recovery processor:', error);
    return NextResponse.json(
      { error: 'Failed to process reminders', details: error.message },
      { status: 500 }
    );
  }
}
