import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware-client';
import { routing } from './i18n/routing';
// import { isPublicRoute } from '@/lib/utils/routes'; // Commented out as per new requirement
// import { match as matchLocale } from '@formatjs/intl-localematcher'; // Included in your original, keep if used
// import Negotiator from 'negotiator'; // Included in your original, keep if used

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  console.log('🛡️ Middleware running for:', request.nextUrl.pathname);

  const intlResponse = intlMiddleware(request);
  const isIntlRedirect =
    intlResponse.status >= 300 && intlResponse.status < 400;
  const isIntlRewrite = intlResponse.headers.has('x-middleware-rewrite');

  if (isIntlRedirect || isIntlRewrite) {
    console.log(
      `🛡️ next-intl middleware handled the request (Status: ${intlResponse.status}, Rewrite: ${isIntlRewrite}).`,
    );
    // If next-intl redirects or rewrites, it might have set cookies or headers.
    // We should return its response directly.
    return intlResponse;
  }

  // Call your middleware client. This client (from user-provided middleware-client.ts) uses @supabase/ssr
  // and is designed to handle cookie operations correctly by chaining responses.
  const { supabase, response: supabaseClientResponse } =
    createMiddlewareClient(request);

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error('🛡️ Error fetching session in middleware:', sessionError);
    // Potentially redirect to an error page or login
    return NextResponse.redirect(new URL('/login', request.url)); // Adjust redirect URL as needed
  }

  const requestedPath = request.nextUrl.pathname;
  // Assuming you have a function to strip locale from pathname for checks
  // For simplicity, let's assume paths used in isPublicRoute and for role checks are without locale prefix
  // You might need a helper like: getPathWithoutLocale(requestedPath, routing.locales)
  const pathWithoutLocale = stripLocaleFromPath(requestedPath, routing.locales);

  // All pages reaching this point (not excluded by matcher and not redirected by intl) require a session.
  if (!session) {
    console.log(
      '🛡️ No session, redirecting to login for path:',
      pathWithoutLocale,
    );
    // The matcher should exclude /auth/login, so no need for pathWithoutLocale !== '/login' check here.
    return NextResponse.redirect(new URL('/login', request.url));
  }

  console.log(
    '🛡️ Session found, user:',
    session.user.email,
    'checking path:',
    pathWithoutLocale,
  );

  // Role-based access for admin dashboard
  if (pathWithoutLocale.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      console.log(
        '🛡️ User is not admin, redirecting from admin path:',
        pathWithoutLocale,
      );
      return NextResponse.redirect(new URL('/login', request.url)); // Or a generic dashboard / unauthorized page
    }
    console.log('🛡️ Admin user accessing admin path:', pathWithoutLocale);
  }

  // --- Add other role checks or protected route logic here ---

  // If all checks pass, return the response (potentially modified by Supabase client)
  // Merge intl headers before returning
  intlResponse.headers.forEach((value, key) => {
    if (!supabaseClientResponse.headers.has(key)) {
      supabaseClientResponse.headers.set(key, value);
    }
  });
  return supabaseClientResponse;
}

// Helper function (you might want to move this to a utility file)
function stripLocaleFromPath(
  pathname: string,
  locales: readonly string[],
): string {
  const defaultPath = pathname;
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.substring(locale.length + 1);
    }
    // Handle case where path might be just /en or /fr (root of a locale)
    if (pathname === `/${locale}`) {
      return '/';
    }
  }
  return defaultPath;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|auth/.*|api/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
