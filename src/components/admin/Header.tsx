'use client';

// import Image from 'next/image'; // Removed unused import
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // Removed unused import
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'; // Import the LanguageSwitcher
import { useTranslations } from 'next-intl';

// Add isScrolled prop to expected props
interface HeaderProps {
  isScrolled?: boolean;
}

// Accept isScrolled prop, provide default value
export default function Header({ isScrolled = false }: HeaderProps) {
  const { user, profile, loading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  // Initial state from server auth status, if available
  const [optimisticIsLoggedIn, setOptimisticIsLoggedIn] = useState<boolean | null>(null);
  const t = useTranslations('Footer');

  // Read the server-side auth status as soon as component mounts
  useEffect(() => {
    const serverAuthEl = document.getElementById('server-auth-status');
    if (serverAuthEl) {
      const serverLoggedIn = serverAuthEl.getAttribute('data-user-logged-in') === 'true';
      setOptimisticIsLoggedIn(serverLoggedIn);
    }
  }, []);

  const handleSignOut = () => {
    setIsSigningOut(true);
    // Get the current locale from the URL path
    const locale = window.location.pathname.split('/')[1] || 'en';

    // Use the dedicated logout route with locale
    window.location.href = `/${locale}/logout`;
  };

  // Determine what to display based on auth state
  const showLoadingState = loading && optimisticIsLoggedIn === null;
  const showLoggedIn = user || (!loading && optimisticIsLoggedIn === true);

  return (
    // Add transition class and conditional shadow class
    <header
      className={`sticky top-0 z-10 border-b border-accent-primary/10 bg-white backdrop-blur-sm transition-shadow duration-200 ${
        isScrolled ? 'shadow-md' : 'shadow-none' // Apply shadow conditionally
      }`}
    >
      <div className="container flex h-20 items-center justify-between pl-4 pr-0 py-2 md:pl-6 md:pr-0">
        {/* Navigation to OSFS World */}
        <div className="flex items-center">
          <Link
            href="https://osfs.world/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-primary/80 transition-colors duration-200 text-sm font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
{t('backToOsfsWorld')}
          </Link>
        </div>

        <div className="flex items-center gap-4 pr-4 md:pr-6">
          {/* Add LanguageSwitcher here */}
          <LanguageSwitcher />

          {/* Removed Notification Icons Block */}
          {/* {showLoggedIn && ( ... icon buttons removed ... )} */}

          {showLoadingState ? (
            // Show loading state
            <div className="h-8 w-24 flex items-center justify-end">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-accent-primary border-t-transparent"></span>
            </div>
          ) : showLoggedIn ? (
            // User is authenticated - Restructured
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="h-9 w-9 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-medium shrink-0">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {/* Name and Role */}
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-black"> {/* Name black */}
                  {/* Show user email or skeleton if profile name isn't loaded yet */}
                  {loading && !profile?.name ? (
                      <span className="inline-block h-4 w-20 animate-pulse rounded bg-gray-200"></span>
                    ) : (
                      profile?.name || user?.email || 'User'
                    )}
                </p>
                <p className="text-xs text-text-muted">
                  {/* Show loading indicator for role specifically */}
                  (
                    {loading ? (
                      <span className="inline-block h-3 w-12 animate-pulse rounded bg-gray-200"></span>
                    ) : (
                      profile?.role || 'Role unavailable'
                    )}
                  )
                </p>
              </div>
              {/* Sign Out Button */}
                <Button
                variant="primary" // Changed to primary for blue background
                size="sm" // Consistent size
                className="ml-2" // Spacing
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  loading={isSigningOut}
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </Button>
            </div>
          ) : (
            // User is not authenticated
            <div>
              <Link href="/">
                <Button variant="primary" size="sm" className="shadow-sm">Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}