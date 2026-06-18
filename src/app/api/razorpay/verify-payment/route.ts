import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-key';
const getSupabaseClient = () => createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature, userId } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Missing verification details' }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
    let isSignatureValid = false;

    // 1. Signature verification
    if (orderId.startsWith('order_mock_')) {
      // Graceful local mock bypass
      isSignatureValid = true;
    } else {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');
      isSignatureValid = generatedSignature === signature;
    }

    const supabase = getSupabaseClient();

    // 2. Perform DB Updates on verification outcome
    if (isSignatureValid) {
      // Find the corresponding payment record to fetch product details
      const { data: currentPayment } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .maybeSingle();

      // Update payment record to success
      const { error: paymentUpdateError } = await supabase
        .from('payments')
        .update({
          payment_id: paymentId,
          signature: signature,
          status: 'success',
          updated_at: new Date().toISOString(),
        })
        .eq('order_id', orderId);

      if (paymentUpdateError) {
        console.error('Error updating payment record to success:', paymentUpdateError);
      }

      // Upgrade user profile tier to 'premium' if purchased Career Report
      const targetUserId = userId || currentPayment?.user_id;
      if (
        targetUserId &&
        targetUserId !== '00000000-0000-0000-0000-000000000000' &&
        currentPayment?.product_name === 'Career Report'
      ) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ tier: 'premium', updated_at: new Date().toISOString() })
          .eq('id', targetUserId);

        if (profileError) {
          console.error('Error upgrading user tier to premium:', profileError);
        }
      }

      // Track Conversion: Mark previous failed/pending payments for this user and product as recovered
      if (targetUserId && currentPayment?.product_name) {
        try {
          await supabase
            .from('payments')
            .update({ is_recovered: true, updated_at: new Date().toISOString() })
            .eq('user_id', targetUserId)
            .eq('product_name', currentPayment.product_name)
            .or('status.eq.failed,status.eq.pending');
        } catch (recoveryErr) {
          console.error('Failed to mark previous payments as recovered:', recoveryErr);
        }
      }

      return NextResponse.json({ success: true, message: 'Payment verified successfully' });
    } else {
      // Update payment record to failed
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('order_id', orderId);

      return NextResponse.json({ success: false, error: 'Signature mismatch' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { error: 'Verification error', details: error.message },
      { status: 500 }
    );
  }
}
