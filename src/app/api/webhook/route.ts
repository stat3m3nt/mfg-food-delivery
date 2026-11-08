/**
 * POST /api/webhook (Stripe)
 *
 * Called by Stripe after a successful payment.
 *  - Verifies the webhook signature (prevents forged events).
 *  - On checkout.session.completed: reads the line items from Stripe, saves the order,
 *    then sends emails.
 *  - Idempotent: Stripe may deliver an event more than once. A duplicate delivery
 *    (unique violation on stripe_session_id) is acknowledged without re-sending emails.
 *
 * IMPORTANT: this route must receive the raw request body for signature verification.
 */
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/server';
import { sendOrderConfirmation, sendOwnerNotification } from '@/lib/email';
import { buildOrderFromSession } from '@/lib/orders';

const UNIQUE_VIOLATION = '23505';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[webhook] Signature verification failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Ignore sessions that are not actually paid (e.g. delayed payment methods).
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
      expand: ['data.price.product'],
    });

    const row = buildOrderFromSession(session, lineItems.data);

    const { data: order, error } = await supabaseAdmin.from('orders').insert(row).select().single();

    if (error) {
      if (error.code === UNIQUE_VIOLATION) {
        // Already processed: acknowledge so Stripe stops retrying.
        return NextResponse.json({ received: true, duplicate: true });
      }
      console.error('[webhook] Supabase insert failed:', error);
      return NextResponse.json({ error: 'DB insert failed' }, { status: 500 }); // Stripe will retry
    }

    // Emails are best-effort: the order is already saved.
    try {
      await Promise.all([sendOrderConfirmation(order), sendOwnerNotification(order)]);
    } catch (emailErr) {
      console.error('[webhook] Email send failed:', emailErr);
    }
  }

  return NextResponse.json({ received: true });
}
