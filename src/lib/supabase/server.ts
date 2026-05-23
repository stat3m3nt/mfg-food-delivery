/**
 * Supabase server client with service role key
 * Only used in API routes and server components — never exposed to the browser
 * The service role key bypasses Row Level Security, handle with care
 */
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);