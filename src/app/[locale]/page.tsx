'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Welcome() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!loading && session) {
      router.push('/dashboard');
    }
  }, [session, loading, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the welcome page if user is logged in (redirect is in progress)
  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-4xl w-full text-center">
          {/* Logo Section */}
          <div className="mb-12">
            <div className="flex justify-center mb-8">
              <Image
                src="/oblate-logo.svg"
                alt="Oblate Logo"
                width={400}
                height={400}
                className="w-[150px] sm:w-[180px] md:w-[200px] h-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-4">
              Formation
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 font-light">
              OSFS Formation Portal
            </p>
          </div>

          {/* Welcome Content */}
          <div className="mb-12 space-y-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-700">
              Welcome to the Formation Portal
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Access resources, connect with your formation community, and continue your journey of spiritual growth and development.
            </p>
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Access Portal
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            <p className="text-sm text-slate-500 mt-4">
              New to the portal?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-800 transition font-medium">
                Create an account
              </Link>
            </p>
          </div>

          {/* Decorative Quote */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <blockquote className="text-slate-600 italic text-lg">
              "Tenui Nec Dimittam"
            </blockquote>
            <p className="text-sm text-slate-500 mt-2">I have held fast and will not let go</p>
          </div>
        </div>
      </main>
    </div>
  );
}
