import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

export async function createClient<Db = Database>() {
  const cookieStore = await (cookies() as unknown as Promise<
    ReturnType<typeof cookies>
  >);
  return createServerClient<Db>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              try {
                cookieStore.set(name, value, options);
              } catch (error) {
                console.warn(`Failed to set cookie ${name}:`, error);
              }
            });
          } catch (error) {
            console.warn('setAll cookies error in Server Component:', error);
          }
        },
      },
    },
  );
}
