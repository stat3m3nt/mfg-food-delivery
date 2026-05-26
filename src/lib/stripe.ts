/**
 * Stripe server-side client
 * Only imported in API routes — never in client components.
 * The secret key is never exposed to the browser.
 */
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Pin to a stable API version
  typescript: true,
});