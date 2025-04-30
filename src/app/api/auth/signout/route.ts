import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { createRedirect, getOrigin } from '@/lib/utils/auth-routes';

export async function GET(request: Request) {
  console.log('🔴 API: Sign-out route called');

  try {
    // Create a direct Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

    try {
      // Try to sign out using the Supabase client
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Error calling supabase.auth.signOut():', e);
      // Continue anyway since we'll clear cookies
    }

    // Create redirect response
    const origin = getOrigin(request);
    const response = createRedirect(`${origin}/`, 303);

    // Clear all known Supabase cookies
    const expires = new Date(0);
    const cookiesToClear = [
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token',
      'sb-auth-token',
      'sb:token',
    ];

    // Set all cookies to expire
    cookiesToClear.forEach((name) => {
      console.log(`🔴 API: Clearing cookie: ${name}`);
      response.cookies.set(name, '', {
        expires,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
      });
    });

    // Also try to clear localStorage in client-side via script
    response.headers.set(
      'Set-Cookie',
      'supabase-logout=true; path=/; max-age=5;',
    );

    return response;
  } catch (error) {
    console.error('🔴 API: Error in sign-out API route:', error);

    // Even on error, redirect to home
    return createRedirect(getOrigin(request) + '/', 303);
  }
}
