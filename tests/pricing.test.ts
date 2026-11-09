import { describe, expect, it } from 'vitest';
import { CartError, priceCart, type CmsDish } from '@/lib/pricing';
import { DELIVERY_FEE_PENCE } from '@/lib/constants';

const dishes: CmsDish[] = [
  { _id: 'jollof', name: 'Jollof Rice', price: 8.5, image: 'https://img/j.jpg' },
  { _id: 'suya', name: 'Suya', price: 0.1 + 0.2 }, // classic float trap
];

describe('priceCart', () => {
  it('prices from CMS data and adds the delivery fee', () => {
    const cart = priceCart([{ id: 'jollof', quantity: 2 }], dishes);
    expect(cart.subtotalPence).toBe(1700);
    expect(cart.deliveryPence).toBe(DELIVERY_FEE_PENCE);
    expect(cart.totalPence).toBe(1700 + DELIVERY_FEE_PENCE);
  });

  it('converts pounds to whole pence without float errors', () => {
    const cart = priceCart([{ id: 'suya', quantity: 1 }], dishes);
    expect(cart.items[0].unitPence).toBe(30);
  });

  it('merges duplicate ids into one line', () => {
    const cart = priceCart(
      [{ id: 'jollof', quantity: 1 }, { id: 'jollof', quantity: 2 }],
      dishes
    );
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(3);
  });

  it('rejects dishes that are missing or unavailable, naming them', () => {
    try {
      priceCart([{ id: 'ghost', quantity: 1 }], dishes);
      throw new Error('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(CartError);
      expect((e as CartError).unavailableIds).toEqual(['ghost']);
    }
  });
});
