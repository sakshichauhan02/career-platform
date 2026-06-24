import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-key';
const getSupabaseClient = () => createClient(supabaseUrl, supabaseKey);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

export async function POST(req: NextRequest) {
  try {
    const { productName, amount, userId } = await req.json();

    if (!productName || !amount) {
      return NextResponse.json({ error: 'Missing productName or amount' }, { status: 400 });
    }

    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

    if (isProduction && (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder')) {
      return NextResponse.json(
        { error: 'Payment gateway is not configured on the server' },
        { status: 500 }
      );
    }

    // 1. Create a Razorpay Order
    let orderId = `order_mock_${Date.now()}`;
    let finalAmount = amount;

    if (process.env.RAZORPAY_KEY_ID !== 'rzp_test_placeholder') {
      try {
        const order = await razorpay.orders.create({
          amount: amount * 100, // Razorpay amount in paise
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
        });
        orderId = order.id;
        finalAmount = Number(order.amount) / 100;
      } catch (rzpErr: any) {
        console.warn('Razorpay order creation failed:', rzpErr);
        if (isProduction) {
          return NextResponse.json(
            { error: 'Failed to initiate payment transaction', details: rzpErr.message },
            { status: 500 }
          );
        }
      }
    }

    const cleanUserId = userId || '00000000-0000-0000-0000-000000000000';
    const supabase = getSupabaseClient();

    // 2. Save the transaction record as 'pending' in payments table
    try {
      const { error } = await supabase.from('payments').insert({
        user_id: cleanUserId,
        order_id: orderId,
        amount: finalAmount,
        status: 'pending',
        product_name: productName,
      });

      if (error) {
        console.error('Error saving pending payment record:', error);
      }
    } catch (dbErr) {
      console.error('Database insertion failed for pending payment:', dbErr);
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: finalAmount * 100, // send back in paise
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}
