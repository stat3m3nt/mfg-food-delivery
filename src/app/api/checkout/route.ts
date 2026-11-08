/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session.
 *  - The request is validated with Zod.
 *  - Prices come from the CMS, never from the request body.
 *  - Only small, fixed-size customer details go in Stripe metadata (500-char limit per value);
 *    the order lines are read back from the session's line items in the webhook.
 *
 * Returns: { url: string } — redirect the user to this Stripe-hosted page
 */
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { client } from '@/lib/sanity/client';
import { DISHES_BY_IDS_QUERY } from '@/lib/sanity/queries';
import { CartError, priceCart, type CmsDish } from '@/lib/pricing';
import { checkoutBodySchema } from '@/lib/validation';
import { DELIVERY_LINE_ITEM_NAME } from '@/lib/constants';

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = checkoutBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: 'Invalid checkout request', issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { items, customerDetails, deliveryAddress, notes } = parsed.data;

  try {
    const ids = [...new Set(items.map((i) => i.id))];
    const dishes = await client.fetch<CmsDish[]>(DISHES_BY_IDS_QUERY, { ids });
    const cart = priceCart(items, dishes);

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerDetails.email,
      line_items: [
        ...cart.items.map((item) => ({
          price_data: {
            currency: 'gbp',
            product_data: {
              name: item.name,
              ...(item.image ? { images: [item.image] } : {}),
              metadata: { dishId: item.id },
            },
            unit_amount: item.unitPence,
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: 'gbp',
            product_data: { name: DELIVERY_LINE_ITEM_NAME },
            unit_amount: cart.deliveryPence,
          },
          quantity: 1,
        },
      ],
      metadata: {
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        deliveryAddress: JSON.stringify(deliveryAddress),
        notes: notes ?? '',
      },
      success_url: `${baseUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof CartError) {
      return NextResponse.json(
        { message: error.message, unavailableIds: error.unavailableIds },
        { status: 409 }
      );
    }
    console.error('[/api/checkout] Error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Failed to create checkout session' }, { status: 500 });
  }
}
