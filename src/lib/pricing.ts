/**
 * Server-side cart pricing.
 *
 * The browser sends only dish IDs and quantities. Prices, names and images are
 * always taken from the CMS, so a tampered request can never change what is charged.
 */
import { DELIVERY_FEE_PENCE } from '@/lib/constants';
import { poundsToPence } from '@/utils/formatPrice';

export interface RequestedItem {
  id: string;
  quantity: number;
}

/** Shape returned by DISHES_BY_IDS_QUERY (price is in pounds, as stored in Sanity). */
export interface CmsDish {
  _id: string;
  name: string;
  price: number;
  image?: string | null;
}

export interface PricedItem {
  id: string;
  name: string;
  unitPence: number;
  quantity: number;
  image?: string;
}

export interface PricedCart {
  items: PricedItem[];
  subtotalPence: number;
  deliveryPence: number;
  totalPence: number;
}

export class CartError extends Error {
  constructor(message: string, public readonly unavailableIds: string[] = []) {
    super(message);
    this.name = 'CartError';
  }
}

export function priceCart(requested: RequestedItem[], dishes: CmsDish[]): PricedCart {
  const byId = new Map(dishes.map((d) => [d._id, d]));

  // Merge duplicate IDs so the same dish can't appear as several lines.
  const merged = new Map<string, number>();
  for (const { id, quantity } of requested) {
    merged.set(id, (merged.get(id) ?? 0) + quantity);
  }

  const missing = [...merged.keys()].filter((id) => !byId.has(id));
  if (missing.length > 0) {
    throw new CartError('Some items are no longer available', missing);
  }

  const items: PricedItem[] = [...merged.entries()].map(([id, quantity]) => {
    const dish = byId.get(id)!;
    return {
      id,
      name: dish.name,
      unitPence: poundsToPence(dish.price),
      quantity,
      image: dish.image ?? undefined,
    };
  });

  const subtotalPence = items.reduce((sum, i) => sum + i.unitPence * i.quantity, 0);
  return {
    items,
    subtotalPence,
    deliveryPence: DELIVERY_FEE_PENCE,
    totalPence: subtotalPence + DELIVERY_FEE_PENCE,
  };
}
