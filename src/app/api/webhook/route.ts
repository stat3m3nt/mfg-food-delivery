/**
 * POST /api/webhook (Stripe)
 *
 * Called by Stripe after a successful payment.
 * Verifies the webhook signature (prevents fake events).
 * On checkout.session.completed:
 *   1. Saves the order to Supabase
 *   2. Sends confirmation email to customer
 *   3. Sends new order notification to owner
 *
 * IMPORTANT: This route must receive the raw request body for
 * signature verification. Do NOT parse it with NextResponse.json().
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendOrderConfirmation, sendOwnerNotification } from '@/lib/email';

export const config = {
  api: { bodyParser: false }, // Required for Stripe signature verification
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  // Verify the event came from Stripe
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata!;

    const items = JSON.parse(meta.items);
    const deliveryAddress = JSON.parse(meta.deliveryAddress);
    const subtotal = session.amount_total! - 299; // Remove delivery fee
    const total = session.amount_total!;

    // Save order to Supabase
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert({
        stripe_session_id: session.id,
        customer_name: meta.customerName,
        customer_email: meta.customerEmail,
        customer_phone: meta.customerPhone,
        delivery_address: deliveryAddress,
        items,
        subtotal,
        delivery_fee: 299,
        total,
        notes: meta.notes || null,
        status: 'confirmed',
      })
      .select()
      .single();

    if (error) {
      console.error('[webhook] Supabase insert failed:', error);
      // Return 500 so Stripe retries the webhook
      return NextResponse.json({ error: 'DB insert failed' }, { status: 500 });
    }

    // Send emails (non-blocking — don't let email failure fail the webhook)
    try {
      await Promise.all([
        sendOrderConfirmation(order),
        sendOwnerNotification(order),
      ]);
    } catch (emailErr) {
      console.error('[webhook] Email send failed:', emailErr);
      // Don't return error — order is saved, emails are best-effort
    }
  }

  return NextResponse.json({ received: true });
}