import { type Database } from '@/types/supabase';
import { createBrowserClient as _createBrowserClient } from '@supabase/ssr';

export function createClient<Db = Database>() {
  // Check if environment variables are defined
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.error('Supabase environment variables are missing!');
  }

  return _createBrowserClient<Db>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
