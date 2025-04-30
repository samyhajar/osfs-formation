'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';

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
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <Image
              src="/oblate-logo.svg"
              alt="Oblate Logo"
              width={40}
              height={40}
              className="h-8 w-auto"
              priority
            />
            <span className="hidden font-bold text-slate-800 sm:inline-block">
              Oblate Formation
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {showLoadingState ? (
            // Show loading state
            <div className="h-8 w-24">
              <p className="text-xs text-slate-400">Loading...</p>
            </div>
          ) : showLoggedIn ? (
            // User is authenticated
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">
                  {profile?.name || user?.email || 'User authenticated'}
                </p>
                <Button
                  variant="ghost"
                  className="h-auto px-2 py-1 text-xs text-slate-600 hover:text-slate-900"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  loading={isSigningOut}
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </Button>
              </div>
            </div>
          ) : (
            // User is not authenticated
            <div>
              <p className="mb-1 text-xs text-slate-500">Not logged in</p>
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