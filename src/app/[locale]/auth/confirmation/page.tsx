'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ConfirmationPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const locale = (params as { locale?: string })?.locale ?? 'en';
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return;

    // If user is logged in, they've successfully confirmed their email
    if (user) {
      setLoading(false);
      // Redirect to dashboard after a brief delay
      const timeout = setTimeout(() => {
        router.push(`/${locale}/dashboard`);
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      // If no user found, there might have been an issue with the confirmation link
      setLoading(false);
      setError('Unable to confirm your account. The link may have expired.');
    }
  }, [user, authLoading, router, locale]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow flex items-center justify-center py-12 px-2 md:px-4">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="text-center mb-8">
            <Image
              src="/oblate-logo.svg"
              alt="Oblate Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Account Confirmed</h1>

            {loading ? (
              <div className="py-4">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-slate-600 mt-4">Confirming your account...</p>
              </div>
            ) : error ? (
              <div className="py-4 text-red-600">
                <p>{error}</p>
                <Link
                  href={`/${locale}`}
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <div className="py-4">
                <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
                  <p>Your account has been successfully confirmed!</p>
                  <p className="mt-2 text-sm">You will be redirected to the dashboard in a few moments.</p>
                </div>
                <Link
                  href={`/${locale}/dashboard`}
                  className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}