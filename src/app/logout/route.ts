import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

export async function GET() {
  // Add await for the server client
  const supabase = await createClient();

  // Sign out the user (this will automatically clear cookies)
  await supabase.auth.signOut();

  // Redirect to the home page
  return NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  );
}
