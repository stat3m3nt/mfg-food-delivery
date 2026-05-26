/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session with:
 * - Line items from the cart
 * - Delivery fee as a separate line item
 * - Customer details stored in Stripe metadata (retrieved via webhook)
 * - Success and cancel URLs
 *
 * Returns: { url: string } — redirect the user to this Stripe-hosted page
 */
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { CartItem } from '@/store/cartStore';
import { DeliveryAddress } from '@/types/order';

const DELIVERY_FEE_PENCE = 299; // £2.99

interface CheckoutBody {
  items: CartItem[];
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: DeliveryAddress;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json();
    const { items, customerDetails, deliveryAddress, notes } = body;

    // Basic server-side validation
    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerDetails.email,

      // Map cart items to Stripe line items
      line_items: [
        ...items.map((item) => ({
          price_data: {
            currency: 'gbp',
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: item.price, // already in pence
          },
          quantity: item.quantity,
        })),
        // Delivery fee as a separate line item
        {
          price_data: {
            currency: 'gbp',
            product_data: { name: 'Delivery' },
            unit_amount: DELIVERY_FEE_PENCE,
          },
          quantity: 1,
        },
      ],

      // Store order data in metadata — retrieved by the webhook after payment
      // Note: Stripe metadata values must be strings
      metadata: {
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        deliveryAddress: JSON.stringify(deliveryAddress),
        items: JSON.stringify(items),
        notes: notes || '',
      },

      success_url: `${baseUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[/api/checkout] Error:', error.message);
    return NextResponse.json(
      { message: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}