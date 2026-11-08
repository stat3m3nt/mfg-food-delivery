import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { create, fetchDishes } = vi.hoisted(() => ({ create: vi.fn(), fetchDishes: vi.fn() }));

vi.mock('@/lib/stripe', () => ({ stripe: { checkout: { sessions: { create } } } }));
vi.mock('@/lib/sanity/client', () => ({ client: { fetch: fetchDishes } }));

import { POST } from '@/app/api/checkout/route';

const body = (items: unknown) => ({
  items,
  customerDetails: { name: 'Ada Obi', email: 'ada@example.com', phone: '07123456789' },
  deliveryAddress: { line1: '1 High Street', city: 'London', postcode: 'E1 6AN' },
});

const req = (payload: unknown) =>
  new NextRequest('http://localhost/api/checkout', { method: 'POST', body: JSON.stringify(payload) });

beforeEach(() => {
  create.mockReset().mockResolvedValue({ url: 'https://stripe.test/session' });
  fetchDishes.mockReset().mockResolvedValue([{ _id: 'jollof', name: 'Jollof Rice', price: 8.5 }]);
});

describe('POST /api/checkout', () => {
  it('charges the CMS price even if the client sends a tampered one', async () => {
    const res = await POST(req(body([{ id: 'jollof', quantity: 1, price: 1, name: 'Free food' }])));
    expect(res.status).toBe(200);
    const args = create.mock.calls[0][0];
    expect(args.line_items[0].price_data.unit_amount).toBe(850); // not 1
    expect(args.line_items[0].price_data.product_data.name).toBe('Jollof Rice');
  });

  it('keeps order lines out of Stripe metadata', async () => {
    await POST(req(body([{ id: 'jollof', quantity: 1 }])));
    expect(create.mock.calls[0][0].metadata).not.toHaveProperty('items');
  });

  it('returns 409 for dishes that are no longer available', async () => {
    const res = await POST(req(body([{ id: 'ghost', quantity: 1 }])));
    expect(res.status).toBe(409);
    expect(create).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid input', async () => {
    const res = await POST(req(body([])));
    expect(res.status).toBe(400);
  });
});
