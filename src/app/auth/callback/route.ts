import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';
import { createAdminClient } from '@/lib/supabase/admin';

// Define a type that includes both old and new role names for backward compatibility
type UserRole = 'admin' | 'editor' | 'user' | 'formator' | 'formee';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabaseServer = await createClient();
    const {
      error: exchangeError,
      data: { session },
    } = await supabaseServer.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error(
        'Root Callback: Error exchanging code for session:',
        exchangeError,
      );
      return NextResponse.redirect(`${origin}/en/login?error=auth_error`);
    }

    if (session?.user) {
      console.log(
        'Root Callback: Session exchanged successfully for user:',
        session.user.id,
      );

      try {
        const supabaseAdmin = createAdminClient();
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error(
            'Root Callback: Admin client error fetching profile:',
            profileError,
          );
          return NextResponse.redirect(`${origin}/en?error=profile_fetch_failed`);
        }

        if (profile?.role) {
          console.log('Root Callback: User role found:', profile.role);
          // Use type assertion to handle both old and new role names
          const role = profile.role as UserRole;

          // Default to 'en' locale for root-level callback
          const locale = 'en';

          switch (role) {
            case 'admin':
              return NextResponse.redirect(
                `${origin}/${locale}/dashboard/admin`,
              );
            case 'editor':
            case 'formator':
              return NextResponse.redirect(
                `${origin}/${locale}/dashboard/editor`,
              );
            case 'user':
            case 'formee':
              return NextResponse.redirect(
                `${origin}/${locale}/dashboard/user`,
              );
            default:
              console.warn('Root Callback: Unknown user role:', profile.role);
              return NextResponse.redirect(
                `${origin}/${locale}/dashboard/user`,
              );
          }
        } else {
          console.warn(
            'Root Callback: Profile or role not found for user (admin fetch):',
            session.user.id,
          );
          return NextResponse.redirect(`${origin}/en?error=profile_missing`);
        }
      } catch (adminError) {
        console.error(
          'Root Callback: Error during admin client profile fetch:',
          adminError,
        );
        return NextResponse.redirect(`${origin}/en?error=admin_fetch_error`);
      }
    } else {
      console.warn('Root Callback: Code exchanged but session or user is null.');
      return NextResponse.redirect(`${origin}/en/login?error=session_null`);
    }
  }

  // If no code is present, redirect to the default locale
  console.warn(
    'Root Callback: No code found in request URL. Redirecting to default locale.',
  );
  return NextResponse.redirect(`${origin}/en`);
}
