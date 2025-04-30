import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();

  // Create a Supabase client (without the ssr features to avoid typing issues)
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Sign out the user (this will automatically clear cookies)
  await supabase.auth.signOut();

  // Redirect to the home page
  return NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  );
}
