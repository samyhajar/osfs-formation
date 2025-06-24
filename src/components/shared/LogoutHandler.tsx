'use client';

import { useEffect } from 'react';

/**
 * Component that handles clearing sessionStorage when logout cookies are detected
 * This ensures the user introduction modal flag is cleared even when logout
 * happens through API routes that don't trigger Supabase auth state changes
 */
export default function LogoutHandler() {
  useEffect(() => {
    // Check for logout cookies and clear sessionStorage accordingly
    const checkLogoutCookies = () => {
      if (typeof document === 'undefined') return;

      const cookies = document.cookie.split(';');
      const hasLogoutCookie = cookies.some(cookie =>
        cookie.trim().startsWith('supabase-logout=true') ||
        cookie.trim().startsWith('clear-intro-flag=true')
      );

              if (hasLogoutCookie) {
          try {
            // Clear the user introduction flag and timestamp
            sessionStorage.removeItem('osfs_user_intro_seen_session');
            sessionStorage.removeItem('osfs_user_intro_timestamp');
            console.log('[LogoutHandler] Cleared user introduction flag and timestamp due to logout cookie');

          // Clear the logout cookies by setting them to expire immediately
          document.cookie = 'supabase-logout=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
          document.cookie = 'clear-intro-flag=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
          console.log('[LogoutHandler] Cleared logout cookies');
        } catch (error) {
          console.warn('[LogoutHandler] Error clearing sessionStorage or cookies:', error);
        }
      }
    };

    // Check immediately
    checkLogoutCookies();

    // Set up an interval to check periodically (in case cookies are set after component mounts)
    const interval = setInterval(checkLogoutCookies, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // This component doesn't render anything
  return null;
}