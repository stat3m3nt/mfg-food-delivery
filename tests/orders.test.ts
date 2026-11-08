import { describe, expect, it } from 'vitest';
import type Stripe from 'stripe';
import { buildOrderFromSession } from '@/lib/orders';

const session = {
  id: 'cs_test_1',
  amount_total: 1999,
  metadata: {
    customerName: 'Ada Obi',
    customerEmail: 'ada@example.com',
    customerPhone: '07123456789',
    deliveryAddress: JSON.stringify({ line1: '1 High St', city: 'London', postcode: 'E1 6AN' }),
    notes: '',
  },
} as unknown as Stripe.Checkout.Session;

const lineItems = [
  { description: 'Jollof Rice', quantity: 2, price: { unit_amount: 850, product: { metadata: { dishId: 'jollof' } } } },
  { description: 'Delivery', quantity: 1, price: { unit_amount: 299, product: { metadata: {} } } },
] as unknown as Stripe.LineItem[];

describe('buildOrderFromSession', () => {
  it('separates delivery from items and derives totals from Stripe', () => {
    const row = buildOrderFromSession(session, lineItems);
    expect(row.items).toEqual([{ id: 'jollof', name: 'Jollof Rice', price: 850, quantity: 2 }]);
    expect(row.delivery_fee).toBe(299);
    expect(row.subtotal).toBe(1700);
    expect(row.total).toBe(1999);
    expect(row.notes).toBeNull();
    expect(row.stripe_session_id).toBe('cs_test_1');
  });
});
