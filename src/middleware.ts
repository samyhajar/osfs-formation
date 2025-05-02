import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
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
  console.log(
    '🛡️ intlMiddleware response headers:',
    Object.fromEntries(intlResponse.headers.entries()),
  );
  console.log('🛡️ intlMiddleware response status:', intlResponse.status);
  console.log(
    '🛡️ intlMiddleware response redirected:',
    intlResponse.redirected,
  );

  // --- TEMPORARY DEBUG: Return intl response directly ---
  console.log('🛡️ DEBUG: Returning intlResponse directly.');
  return intlResponse;
  // --- END TEMPORARY DEBUG ---

  /* --- Original Supabase/Auth Logic (Commented Out) ---
  if (
    intlResponse.redirected ||
    intlResponse.headers.has('x-middleware-rewrite') ||
    intlResponse.headers.has('x-next-intl-redirect')
  ) {
    console.log(
      '🛡️ next-intl middleware handled the request (redirect/rewrite).',
    );
    return intlResponse;
  }

  // If next-intl didn't handle it, proceed with existing Supabase/Auth logic
  console.log('🛡️ next-intl middleware passed through, running auth checks...');

  try {
    // Create Supabase client - it potentially returns a new response with updated cookies
    const { supabase, response: supabaseResponse } =
      createMiddlewareClient(request);

    // --- Existing Auth/RLS Logic (modified slightly) ---
    const pathname = request.nextUrl.pathname; // Use original pathname for checks
    const urlLocale = routing.locales.find((loc) =>
      pathname.startsWith(`/${loc}/`),
    );
    const pathWithoutLocale = urlLocale
      ? pathname.substring(urlLocale.length + 1)
      : pathname;

    // Check if the path (without locale) is public
    const isPublic = isPublicRoute(pathWithoutLocale);
    console.log(`🛡️ Path (w/o locale): ${pathWithoutLocale}`);
    console.log(`🛡️ Is path public? ${isPublic ? 'Yes' : 'No'}`);

    // Allow access to public routes without auth
    if (isPublic) {
      console.log('🛡️ Path is public, allowing access');
      return supabaseResponse; // Use the response from createMiddlewareClient
    }

    // For protected routes, check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('🛡️ Error fetching session:', sessionError);
      // Redirect to root (which will be handled by intlMiddleware to add locale)
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log(
      '🛡️ Auth check:',
      session ? 'User is authenticated' : 'No authenticated user',
    );

    // Check if trying to access protected route without auth
    if (!session) {
      console.log('🛡️ No session found, redirecting to locale root');
      // Redirect to the root of the detected locale (intlMiddleware handles adding prefix)
      const url = new URL('/', request.url);
      // We don't need redirectTo here as login will handle it based on locale
      return NextResponse.redirect(url);
    }

    // --- Role Check for Admin Routes (use pathWithoutLocale) ---
    if (pathWithoutLocale.startsWith('/dashboard/admin')) {
      console.log('🛡️ Accessing admin route, checking role...');
      const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin');

      if (rpcError) {
        console.error('🛡️ Error calling is_admin RPC:', rpcError);
        // Redirect to general dashboard (within the current locale)
        return NextResponse.redirect(
          new URL(`${urlLocale ? '/' + urlLocale : ''}/dashboard`, request.url),
        );
      }

      console.log(`🛡️ User is admin? ${isAdmin ? 'Yes' : 'No'}`);
      if (!isAdmin) {
        console.log('🛡️ User is not admin, redirecting to general dashboard');
        // Redirect non-admins away from /dashboard/admin to the main dashboard (within locale)
        return NextResponse.redirect(
          new URL(`${urlLocale ? '/' + urlLocale : ''}/dashboard`, request.url),
        );
      }
      console.log('🛡️ User is admin, allowing access to admin route');
    }

    // User is authenticated and can access the route
    console.log('🛡️ Auth checks passed, allowing access.');
    return supabaseResponse; // Use the response from createMiddlewareClient
  } catch (e) {
    console.error('🛡️ Middleware error:', e);
    const urlLocale = routing.locales.find((loc) =>
      request.nextUrl.pathname.startsWith(`/${loc}/`),
    );
    const pathWithoutLocale = urlLocale
      ? request.nextUrl.pathname.substring(urlLocale.length + 1)
      : request.nextUrl.pathname;

    // On error, redirect to locale root if trying to access protected route
    if (pathWithoutLocale.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', request.url)); // Redirect to root (intl will handle locale)
    }

    // If there's an error but not on a protected route, just continue
    console.log('🛡️ Non-protected route error, passing through.');
    // We need a response object here. Since intl didn't provide one, and supabase client might not have been created,
    // we pass through using NextResponse.next(). If createMiddlewareClient *did* run and create supabaseResponse,
    // we should ideally use that, but handling all error paths gets complex. Simplest is often NextResponse.next().
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
  */
}

export const config = {
  matcher: [
    // Match all paths except for internal Next.js paths, API routes, and static files.
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Explicitly include the root path if it wasn't caught by the above
    '/',
  ],
};
