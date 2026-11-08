/**
 * Pure helper that turns a paid Stripe Checkout Session (plus its line items)
 * into a row for the `orders` table. Kept free of I/O so it is easy to test.
 */
import type Stripe from 'stripe';
import { DELIVERY_LINE_ITEM_NAME } from '@/lib/constants';
import type { OrderItem } from '@/types/order';

export interface OrderInsert {
  stripe_session_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_address: unknown;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  notes: string | null;
  status: 'confirmed';
}

export function buildOrderFromSession(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.LineItem[]
): OrderInsert {
  const meta = session.metadata ?? {};

  let delivery_fee = 0;
  const items: OrderItem[] = [];

  for (const li of lineItems) {
    const unit = li.price?.unit_amount ?? 0;
    const product = li.price?.product;
    const dishId =
      product && typeof product === 'object' && 'metadata' in product
        ? (product.metadata?.dishId ?? '')
        : '';

    if (!dishId && li.description === DELIVERY_LINE_ITEM_NAME) {
      delivery_fee = unit * (li.quantity ?? 1);
      continue;
    }
    items.push({
      id: dishId,
      name: li.description ?? 'Item',
      price: unit,
      quantity: li.quantity ?? 1,
    });
  }

  const total = session.amount_total ?? 0;
  return {
    stripe_session_id: session.id,
    customer_name: meta.customerName ?? '',
    customer_email: meta.customerEmail ?? session.customer_details?.email ?? '',
    customer_phone: meta.customerPhone || null,
    delivery_address: meta.deliveryAddress ? JSON.parse(meta.deliveryAddress) : {},
    items,
    subtotal: total - delivery_fee,
    delivery_fee,
    total,
    notes: meta.notes || null,
    status: 'confirmed',
  };
}
