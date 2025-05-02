import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware-client';
import { isPublicRoute } from '@/lib/utils/routes';
// Import Database type if needed for RPC response typing
// import { Database } from '@/types/supabase';

export async function middleware(request: NextRequest) {
  console.log('🛡️ Middleware running for:', request.nextUrl.pathname);

  try {
    // Create a Supabase client using our middleware client
    const { supabase, response } = createMiddlewareClient(request);

    const pathname = request.nextUrl.pathname;

    // Check if the path is public
    const isPublic = isPublicRoute(pathname);
    console.log(`🛡️ Is path public? ${isPublic ? 'Yes' : 'No'}`);

    // Allow access to public routes without auth
    if (isPublic) {
      console.log('🛡️ Path is public, allowing access');
      return response;
    }

    // For protected routes, check authentication
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('🛡️ Error fetching session:', sessionError);
      // Handle appropriately, maybe redirect home
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log(
      '🛡️ Auth check:',
      session ? 'User is authenticated' : 'No authenticated user',
    );

    // Check if trying to access protected route without auth
    if (!session) {
      console.log('🛡️ No session found, redirecting to home page');
      const url = request.nextUrl.clone();
      url.pathname = '/'; // Redirect to home page where login form is
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }

    // --- Role Check for Admin Routes ---
    if (pathname.startsWith('/dashboard/admin')) {
      console.log('🛡️ Accessing admin route, checking role...');
      // Call the is_admin function we created earlier
      // Ensure the is_admin function exists and is accessible
      const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin');

      if (rpcError) {
        console.error('🛡️ Error calling is_admin RPC:', rpcError);
        // Redirect to general dashboard on RPC error
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      console.log(`🛡️ User is admin? ${isAdmin ? 'Yes' : 'No'}`);
      if (!isAdmin) {
        console.log('🛡️ User is not admin, redirecting to general dashboard');
        // Redirect non-admins away from /dashboard/admin to the main dashboard
        // Note: Later, the login callback should redirect them to their specific dashboard (/formant or /formee)
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      console.log('🛡️ User is admin, allowing access to admin route');
    }

    // User is authenticated and can access the route
    return response;
  } catch (e) {
    console.error('🛡️ Middleware error:', e);
    // On error, redirect to home if trying to access protected route
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // If there's an error but not on a protected route, just continue
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
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets (images, fonts, etc.)
     */
    '/((?!api|_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
