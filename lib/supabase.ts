import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is a client-side Supabase instance.
// Note: This instance is limited by your Row Level Security (RLS) policies.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// This is a server-side Supabase instance using the service role key.
// IMPORTANT: This instance bypasses all RLS policies. Use it ONLY in server environments.
export const getSupabaseServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
  }
  return createClient(supabaseUrl, serviceRoleKey);
};
