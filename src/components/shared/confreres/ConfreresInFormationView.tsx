'use client';

import { useConfreresInFormation } from '@/hooks/useConfreresInFormation';
import ConfreresTable from '@/components/shared/confreres/ConfreresTable';
import { useState, useEffect } from 'react';

interface ConfreresInFormationViewProps {
  userRole: 'admin' | 'editor' | 'user';
}

export default function ConfreresInFormationView({ userRole }: ConfreresInFormationViewProps) {
  const { members, loading, error, refetch, isRefreshing, isEmpty } = useConfreresInFormation();
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!loading) setHasFetchedOnce(true);
  }, [loading]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 mb-1">Loading confreres in formation...</p>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Warming up the cache—this may take a moment, but future visits will be faster.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => void refetch()}
            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Role-specific description
  const getDescription = () => {
    if (userRole === 'admin') {
      return 'Browse and manage confreres in formation: Postulant, Novice, Bro. Novice, Scholastic, and Deacon.';
    }
    return 'Browse confreres in formation: Postulant, Novice, Bro. Novice, Scholastic, and Deacon.';
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Confreres in Formation</h1>
          {isRefreshing && (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" title="Refreshing data in background"></div>
          )}
        </div>
        <p className="mt-2 text-gray-600">
          {getDescription()}
        </p>
      </div>

      {isEmpty && hasFetchedOnce ? (
        <p className="text-gray-600">No confreres found.</p>
      ) : (
        <ConfreresTable members={members} />
      )}
    </div>
  );
}