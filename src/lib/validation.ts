/** Server-side request validation (the client form validates too, but is never trusted). */
import { z } from 'zod';
import { MAX_DISTINCT_ITEMS, MAX_QTY_PER_ITEM } from '@/lib/constants';

// Unknown keys (e.g. a client-supplied "price") are stripped by z.object.
export const checkoutBodySchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1).max(100),
        quantity: z.number().int().min(1).max(MAX_QTY_PER_ITEM),
      })
    )
    .min(1, 'Cart is empty')
    .max(MAX_DISTINCT_ITEMS),
  customerDetails: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().min(10).max(20),
  }),
  deliveryAddress: z.object({
    line1: z.string().trim().min(3).max(120),
    line2: z.string().trim().max(120).optional(),
    city: z.string().trim().min(2).max(80),
    postcode: z.string().trim().min(5).max(10),
  }),
  notes: z.string().trim().max(300).optional(),
});

export type CheckoutBody = z.infer<typeof checkoutBodySchema>;
