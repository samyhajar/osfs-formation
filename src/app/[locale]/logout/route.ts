import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';
import { getOrigin } from '@/lib/utils/auth-routes';

export async function GET(request: Request) {
  // Add await for the server client
  const supabase = await createClient();

  // Sign out the user (this will automatically clear cookies)
  await supabase.auth.signOut();

  // Get the origin from the request (works in all environments including Vercel)
  const origin = getOrigin(request);

  // Redirect to the home page using the correct origin
  return NextResponse.redirect(new URL('/', origin));
}
