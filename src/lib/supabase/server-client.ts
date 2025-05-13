import {
  createServerClient,
  type CookieOptions as SupabaseCookieOptions,
} from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

// Define the expected cookie structure for Supabase
interface SupabaseCookie {
  name: string;
  value: string;
  options?: SupabaseCookieOptions;
}

// Define a type for the cookie from Next.js
interface NextCookie {
  name: string;
  value: string;
}

// This function is for use in Server Components, Route Handlers, and Server Actions
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll(): SupabaseCookie[] {
          const allCookies = cookieStore.getAll();
          return allCookies.map((cookie: NextCookie) => ({
            name: cookie.name,
            value: cookie.value,
            options: undefined, // Explicitly match SupabaseCookie type
          }));
        },
        setAll(cookiesToSet: SupabaseCookie[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              const supabaseOptions = options || {};
              const nextCookieOptions: Record<string, unknown> = {
                domain: supabaseOptions.domain,
                expires: supabaseOptions.expires,
                httpOnly: supabaseOptions.httpOnly,
                maxAge: supabaseOptions.maxAge,
                path: supabaseOptions.path,
                sameSite:
                  supabaseOptions.sameSite === 'none' ||
                  supabaseOptions.sameSite === 'lax' ||
                  supabaseOptions.sameSite === 'strict'
                    ? supabaseOptions.sameSite
                    : undefined,
                secure: supabaseOptions.secure,
              };

              // Remove undefined properties
              Object.keys(nextCookieOptions).forEach((key) => {
                if (nextCookieOptions[key] === undefined) {
                  delete nextCookieOptions[key];
                }
              });

              // No type assertion needed
              cookieStore.set(name, value, nextCookieOptions);
            });
          } catch (_err) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions,
            // or if the user is logged out.
          }
        },
      },
    },
  );
}
