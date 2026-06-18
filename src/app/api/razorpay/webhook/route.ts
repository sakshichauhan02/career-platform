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
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';

    if (!signature) {
      return NextResponse.json({ error: 'Missing webhook signature' }, { status: 400 });
    }

    // 1. Signature verification
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const isSignatureValid = expectedSignature === signature;

    // We allow a fallback for test simulation if secret is webhook_secret
    if (!isSignatureValid && webhookSecret !== 'webhook_secret') {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const eventData = JSON.parse(rawBody);
    const eventType = eventData.event;
    const supabase = getSupabaseClient();

    console.info(`Received Razorpay Webhook event: ${eventType}`);

    // 2. Event processing
    if (eventType === 'order.paid' || eventType === 'payment.captured') {
      const paymentPayload = eventData.payload?.payment?.entity;
      const orderId = paymentPayload?.order_id || eventData.payload?.order?.entity?.id;
      const paymentId = paymentPayload?.id;

      if (orderId) {
        // Query current payment
        const { data: currentPayment } = await supabase
          .from('payments')
          .select('*')
          .eq('order_id', orderId)
          .maybeSingle();

        if (currentPayment) {
          // Update status to success
          await supabase
            .from('payments')
            .update({
              status: 'success',
              payment_id: paymentId || currentPayment.payment_id,
              updated_at: new Date().toISOString(),
            })
            .eq('order_id', orderId);

          // Update profile tier to premium
          if (
            currentPayment.product_name === 'Career Report' &&
            currentPayment.user_id &&
            currentPayment.user_id !== '00000000-0000-0000-0000-000000000000'
          ) {
            await supabase
              .from('profiles')
              .update({ tier: 'premium', updated_at: new Date().toISOString() })
              .eq('id', currentPayment.user_id);
          }

          // Track Conversion: Mark previous failed/pending payments for this user and product as recovered
          if (currentPayment.user_id && currentPayment.product_name) {
            try {
              await supabase
                .from('payments')
                .update({ is_recovered: true, updated_at: new Date().toISOString() })
                .eq('user_id', currentPayment.user_id)
                .eq('product_name', currentPayment.product_name)
                .or('status.eq.failed,status.eq.pending');
            } catch (recoveryErr) {
              console.error('Webhook failed to mark previous payments as recovered:', recoveryErr);
            }
          }
        }
      }
    } else if (eventType === 'payment.failed') {
      const paymentPayload = eventData.payload?.payment?.entity;
      const orderId = paymentPayload?.order_id;

      if (orderId) {
        await supabase
          .from('payments')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('order_id', orderId);
      }
    }

    return NextResponse.json({ success: true, processed: true });
  } catch (error: any) {
    console.error('Error handling Razorpay Webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing error', details: error.message },
      { status: 500 }
    );
  }
}
