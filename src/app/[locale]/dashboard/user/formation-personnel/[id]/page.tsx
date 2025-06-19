'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { fetchMemberById } from '@/lib/wordpress/api';
import type { WPMember } from '@/lib/wordpress/types';
import { useAuth } from '@/contexts/AuthContext';
import MemberProfile from '@/components/user/formation-personnel/MemberProfile';

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const { profile, loading: authLoading } = useAuth();

  const [member, setMember] = useState<WPMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const memberId = Array.isArray(params.id) ? params.id[0] : params.id;

  // Check authorization - only allow users with "user" role
  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== 'user')) {
      router.push(`/${locale}/dashboard`);
      return;
    }
  }, [profile, authLoading, router, locale]);

  useEffect(() => {
    async function loadMember() {
      if (!memberId || authLoading || !profile || profile.role !== 'user') {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const memberIdNumber = parseInt(memberId, 10);
        if (isNaN(memberIdNumber)) {
          setError('Invalid member ID');
          return;
        }

        const memberData = await fetchMemberById(memberIdNumber);

        if (!memberData) {
          setError('Member not found');
          return;
        }

        setMember(memberData);
      } catch (err) {
        console.error('Error loading member:', err);
        setError('Failed to load member details');
      } finally {
        setLoading(false);
      }
    }

    void loadMember();
  }, [memberId, authLoading, profile]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has access
  if (!profile || profile.role !== 'user') {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading member details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={`/${locale}/dashboard/user/formation-personnel`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Formation Personnel
          </Link>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href={`/${locale}/dashboard/user/formation-personnel`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Formation Personnel
          </Link>
        </div>

        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Member Not Found</h2>
          <p className="text-gray-600">The requested member could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href={`/${locale}/dashboard/user/formation-personnel`}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Formation Personnel
          </Link>
        </div>

        {/* Member Profile */}
        <MemberProfile member={member} />
      </div>
    </div>
  );
}