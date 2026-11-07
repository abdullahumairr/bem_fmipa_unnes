import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/backend/config';

let browserClient: SupabaseClient | null = null;

let publicClient: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient {
  if (publicClient) return publicClient;
  publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return publicClient;
}

export function getSupabaseBrowser(): SupabaseClient {
  if (browserClient) return browserClient;
  browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return browserClient;
}

export function createServerClient(authHeader: string | null): SupabaseClient {
  const token = authHeader?.replace('Bearer ', '').trim();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
    global: { headers },
  });
}
