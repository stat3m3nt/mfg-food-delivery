import { describe, expect, it } from 'vitest';
import { checkoutBodySchema } from '@/lib/validation';

const valid = {
  items: [{ id: 'jollof', quantity: 2 }],
  customerDetails: { name: 'Ada Obi', email: 'ada@example.com', phone: '07123456789' },
  deliveryAddress: { line1: '1 High Street', city: 'London', postcode: 'E1 6AN' },
};

describe('checkoutBodySchema', () => {
  it('accepts a valid request', () => {
    expect(checkoutBodySchema.safeParse(valid).success).toBe(true);
  });

  it('strips client-supplied prices', () => {
    const r = checkoutBodySchema.parse({ ...valid, items: [{ id: 'jollof', quantity: 1, price: 1 }] });
    expect(r.items[0]).toEqual({ id: 'jollof', quantity: 1 });
  });

  it.each([
    ['empty cart', { ...valid, items: [] }],
    ['zero quantity', { ...valid, items: [{ id: 'a', quantity: 0 }] }],
    ['fractional quantity', { ...valid, items: [{ id: 'a', quantity: 1.5 }] }],
    ['huge quantity', { ...valid, items: [{ id: 'a', quantity: 9999 }] }],
    ['bad email', { ...valid, customerDetails: { ...valid.customerDetails, email: 'nope' } }],
    ['overlong notes', { ...valid, notes: 'x'.repeat(301) }],
  ])('rejects %s', (_name, body) => {
    expect(checkoutBodySchema.safeParse(body).success).toBe(false);
  });
});
