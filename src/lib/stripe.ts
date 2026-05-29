/**
 * Stripe server-side client
 * Only imported in API routes — never in client components.
 * The secret key is never exposed to the browser.
 */
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia', // Pin to a stable API version
  typescript: true,
});