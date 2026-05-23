/**
 * Sanity client configuration
 * Uses the project ID and dataset from environment variables.
 * The `useCdn` flag enables edge caching for production reads.
 */
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01', // Use a stable date-based API version
  useCdn: process.env.NODE_ENV === 'production', // CDN in prod, live in dev
  token: process.env.SANITY_API_READ_TOKEN,
});