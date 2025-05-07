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

  // Skip next-intl middleware for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log('🛡️ API route detected, skipping intl middleware');

    // For API routes, just handle Supabase auth
    try {
      const { supabase, response: supabaseResponse } =
        createMiddlewareClient(request);

      // Handle auth for API routes if needed
      const isPublic = isPublicRoute(request.nextUrl.pathname);

      if (isPublic) {
        return supabaseResponse;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      return supabaseResponse;
    } catch (e) {
      console.error('🛡️ API Middleware error:', e);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 },
      );
    }
  }

  // Log all cookies for debugging
  console.log('🔍 Cookies:');
  request.cookies.getAll().forEach((cookie) => {
    console.log(`🍪 ${cookie.name}: ${cookie.value}`);
  });

  // Debug route to clear cookies
  if (request.nextUrl.pathname.endsWith('/debug-clear-cookie')) {
    console.log('🔍 DEBUG: Clearing intro_page_seen cookie');
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('intro_page_seen', '', {
      maxAge: 0,
      path: '/',
    });
    return response;
  }

  // Run next-intl middleware for non-API routes
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

    console.log('🔍 Original pathname:', pathname);
    console.log('🔍 Detected locale:', urlLocale || 'none');
    console.log('🔍 Path without locale:', pathWithoutLocale);

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

    // Check user role for user redirect - for ANY dashboard path
    if (pathWithoutLocale.startsWith('dashboard')) {
      console.log('🔍 Dashboard path detected:', pathWithoutLocale);

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role, is_approved')
        .eq('id', session.user.id)
        .single();

      console.log('🔍 User profile role:', userProfile?.role);
      console.log('🔍 User is approved:', userProfile?.is_approved);

      // Redirect to pending approval page if user is not approved
      if (userProfile?.is_approved === false) {
        console.log(
          '🛡️ User is not approved, redirecting to pending approval page',
        );
        return NextResponse.redirect(
          new URL(
            `${urlLocale ? '/' + urlLocale : ''}/auth/pending-approval`,
            request.url,
          ),
        );
      }

      // Check role-specific dashboard access
      if (
        pathWithoutLocale.startsWith('dashboard/admin') &&
        userProfile?.role !== 'admin'
      ) {
        console.log(
          '🛡️ Non-admin user trying to access admin dashboard, redirecting to general dashboard',
        );
        return NextResponse.redirect(
          new URL(`${urlLocale ? '/' + urlLocale : ''}/dashboard`, request.url),
        );
      }

      if (
        pathWithoutLocale.startsWith('dashboard/editor') &&
        userProfile?.role !== 'editor'
      ) {
        console.log(
          '🛡️ Non-editor user trying to access editor dashboard, redirecting to general dashboard',
        );
        return NextResponse.redirect(
          new URL(`${urlLocale ? '/' + urlLocale : ''}/dashboard`, request.url),
        );
      }

      if (
        pathWithoutLocale.startsWith('dashboard/user') &&
        userProfile?.role !== 'user'
      ) {
        console.log(
          '🛡️ Non-user trying to access user dashboard, redirecting to general dashboard',
        );
        return NextResponse.redirect(
          new URL(`${urlLocale ? '/' + urlLocale : ''}/dashboard`, request.url),
        );
      }
    }

    // The admin check is redundant now since we've already checked above, but keeping it for backward compatibility
    if (pathWithoutLocale.startsWith('dashboard/admin')) {
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

    if (pathWithoutLocale.startsWith('dashboard')) {
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
     * - API routes should be handled separately
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
