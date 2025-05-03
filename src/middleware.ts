import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
// Restore Supabase/Auth related imports
import { createMiddlewareClient } from '@/lib/supabase/middleware-client';
import { isPublicRoute } from '@/lib/utils/routes';
import { routing } from './i18n/routing';
// Import Database type if needed for RPC response typing
// import { Database } from '@/types/supabase';

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  console.log('🛡️ Middleware running for:', request.nextUrl.pathname);

  // Run next-intl middleware first to handle locale redirects/detection
  const intlResponse = intlMiddleware(request);

  // --- Modified Check for Redirect/Rewrite ---
  // Check if the response status indicates a redirect (3xx) or if it's a rewrite
  const isRedirect = intlResponse.status >= 300 && intlResponse.status < 400;
  const isRewrite = intlResponse.headers.has('x-middleware-rewrite');

  if (isRedirect || isRewrite) {
    console.log(
      `🛡️ next-intl middleware handled the request (Status: ${intlResponse.status}, Rewrite: ${isRewrite}).`,
    );
    return intlResponse;
  }

  // If next-intl didn't handle it, proceed with existing Supabase/Auth logic
  console.log('🛡️ next-intl middleware passed through, running auth checks...');

  try {
    const { supabase, response: supabaseResponse } =
      createMiddlewareClient(request);

    const pathname = request.nextUrl.pathname;
    const urlLocale = routing.locales.find((loc) =>
      pathname.startsWith(`/${loc}/`),
    );
    const pathWithoutLocale = urlLocale
      ? pathname.substring(urlLocale.length + 1)
      : pathname;

    const isPublic = isPublicRoute(pathWithoutLocale);
    console.log(`🛡️ Path (w/o locale): ${pathWithoutLocale}`);
    console.log(`🛡️ Is path public? ${isPublic ? 'Yes' : 'No'}`);

    if (isPublic) {
      console.log('🛡️ Path is public, allowing access');
      return supabaseResponse;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('🛡️ Error fetching session:', sessionError);
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log(
      '🛡️ Auth check:',
      session ? 'User is authenticated' : 'No authenticated user',
    );

    if (!session) {
      console.log('🛡️ No session found, redirecting to locale root');
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }

    if (pathWithoutLocale.startsWith('/dashboard/admin')) {
      // Restore admin check logic if it was removed
      console.log('🛡️ Accessing admin route, checking role...');
      const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin');

      if (rpcError) {
        console.error('🛡️ Error calling is_admin RPC:', rpcError);
        return NextResponse.redirect(
          new URL(`${urlLocale ? '/' + urlLocale : ''}/dashboard`, request.url),
        );
      }

      console.log(`🛡️ User is admin? ${isAdmin ? 'Yes' : 'No'}`);
      if (!isAdmin) {
        console.log('🛡️ User is not admin, redirecting to general dashboard');
        return NextResponse.redirect(
          new URL(`${urlLocale ? '/' + urlLocale : ''}/dashboard`, request.url),
        );
      }
      console.log('🛡️ User is admin, allowing access to admin route');
    }

    console.log('🛡️ Auth checks passed, allowing access.');
    return supabaseResponse;
  } catch (e) {
    console.error('🛡️ Middleware error:', e);
    const urlLocale = routing.locales.find((loc) =>
      request.nextUrl.pathname.startsWith(`/${loc}/`),
    );
    const pathWithoutLocale = urlLocale
      ? request.nextUrl.pathname.substring(urlLocale.length + 1)
      : request.nextUrl.pathname;

    if (pathWithoutLocale.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log('🛡️ Non-protected route error, passing through.');
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any files extensions like .svg, .png, etc.
     * Include /api routes so next-intl can prefix them.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
