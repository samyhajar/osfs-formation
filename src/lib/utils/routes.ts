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
  return publicRoutes.some((route) => {
    // Exact match
    if (route === path) {
      return true;
    }

    // Path with wildcard at the end (e.g., /auth/**)
    if (route.endsWith('/**')) {
      const baseRoute = route.slice(0, -3);
      return path.startsWith(baseRoute);
    }

    return false;
  });
}
