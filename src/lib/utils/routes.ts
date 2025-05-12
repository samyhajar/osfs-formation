/**
 * Route configuration for the application.
 * This file defines which routes are public (accessible without authentication).
 * All other routes require authentication by default.
 */

export const publicRoutes = [
  '/', // Home/landing page
  '/login', // Login page
  '/signup', // Signup page
  '/forgot-password', // Forgot password page
  '/reset-password', // Reset password page
  '/error', // Error page
  '/auth/**', // Auth callbacks (supports wildcard)
  '/api/auth/**', // API auth endpoints
  '/about', // About page
  '/contact', // Contact page
  '/legal/privacy', // Privacy policy
  '/legal/terms', // Terms of service
];

/**
 * Checks if a path matches any of the public routes.
 * Supports exact matches and wildcard patterns (e.g., '/auth/**').
 */
export function isPublicRoute(path: string): boolean {
  const publicPaths = [
    '',
    '/',
    '/login',
    '/signup',
    '/auth/pending-approval',
    '/auth/reset-password',
    '/auth/callback',
    '/auth/confirm',
    '/about',
    '/contact',
    '/resources',
    '/debug-clear-cookie',
  ];

  // Check if path is in the publicPaths array
  if (publicPaths.includes(path)) {
    return true;
  }

  // Check if path starts with any of these prefixes
  const publicPrefixes = ['/auth/', '/api/auth/'];

  return publicPrefixes.some((prefix) => path.startsWith(prefix));
}
