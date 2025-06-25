'use client';

import { useState, useEffect } from 'react';
import { useFormationPersonnel } from '@/hooks/useFormationPersonnel';
import FormationPersonnelTable from './FormationPersonnelTable';

interface FormationPersonnelViewProps {
  userRole: 'admin' | 'editor' | 'user';
}

export default function FormationPersonnelView({ userRole }: FormationPersonnelViewProps) {
  const { formationPersonnel, loading, error, isEmpty, refetch, isRefreshing } = useFormationPersonnel();
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  useEffect(() => {
    if (!loading) {
      setHasFetchedOnce(true);
    }
  }, [loading]);

  const handleEmailSelected = (emails: string[]) => {
    setSelectedEmails(emails);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 mb-1">Loading formation personnel...</p>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Warming up the cache—this may take a moment, but future visits will be faster.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => void refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Formation Personnel
          </h1>
          {isRefreshing && (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" title="Refreshing data in background"></div>
          )}
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {userRole === 'admin'
            ? 'Browse and manage formation personnel who guide and support the spiritual and academic development of our seminarians and candidates.'
            : 'Meet our dedicated formation leaders who guide and support the spiritual and academic development of our seminarians and candidates throughout their journey of discernment and preparation for religious life.'
          }
        </p>
      </div>

      {/* Formation Personnel Table */}
      {isEmpty && hasFetchedOnce ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Formation Personnel Found</h3>
          <p className="text-gray-600">
            No active formation personnel are currently available. Please check back later or contact an administrator.
          </p>
        </div>
      ) : (
        <FormationPersonnelTable
          members={formationPersonnel}
          onEmailSelected={handleEmailSelected}
        />
      )}

      {/* Footer Note */}
      {!isEmpty && hasFetchedOnce && (
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            For more information about our formation programs or to contact any of our formation personnel,
            please reach out to your local community or provincial office.
          </p>
          {selectedEmails.length > 0 && (
            <p className="text-sm text-blue-600 mt-2">
              {selectedEmails.length} member{selectedEmails.length !== 1 ? 's' : ''} selected for email
            </p>
          )}
        </div>
      )}
    </div>
  );
}