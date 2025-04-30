'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import { BellIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { user, profile, loading, session } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  // Initial state from server auth status, if available
  const [optimisticIsLoggedIn, setOptimisticIsLoggedIn] = useState<boolean | null>(null);

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
    // Use a simple link to the sign-out API route - no need for fetch
    window.location.href = '/api/auth/signout';
  };

  // Determine what to display based on auth state
  const showLoadingState = loading && optimisticIsLoggedIn === null;
  const showLoggedIn = user || (!loading && optimisticIsLoggedIn === true);
  const showLoggedOut = !loading && !user && optimisticIsLoggedIn !== true;

  return (
    <header className="sticky top-0 z-10 border-b border-accent-primary/10 bg-white/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 py-2 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 transition-colors">
            <Image
              src="/oblate-logo.svg"
              alt="Oblate Logo"
              width={40}
              height={40}
              className="h-9 w-auto"
              priority
            />
            <span className="hidden font-bold text-accent-primary sm:inline-block">
              Oblate Formation
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification icons */}
          <div className="hidden md:flex items-center gap-1">
            <button className="p-2 rounded-full text-text-secondary hover:bg-accent-primary/5 hover:text-accent-primary transition-colors">
              <BellIcon className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full text-text-secondary hover:bg-accent-primary/5 hover:text-accent-primary transition-colors">
              <EnvelopeIcon className="h-5 w-5" />
            </button>
          </div>

          {showLoadingState ? (
            // Show loading state
            <div className="h-8 w-24 flex items-center justify-end">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-accent-primary border-t-transparent"></span>
            </div>
          ) : showLoggedIn ? (
            // User is authenticated
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">
                  {profile?.name || user?.email || 'User authenticated'}
                </p>
                <Button
                  variant="ghost"
                  className="h-auto px-2 py-1 text-xs text-text-secondary hover:text-accent-primary"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  loading={isSigningOut}
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </Button>
              </div>
              <div className="h-9 w-9 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-medium">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
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