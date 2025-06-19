'use client';

import { useState, useEffect } from 'react';
import { fetchConfreresInFormation } from '@/lib/wordpress/api';
import type { WPMember } from '@/lib/wordpress/types';
import ConfreresTable from '@/components/shared/confreres/ConfreresTable';

export default function AdminConfreresInFormationPage() {
  const [members, setMembers] = useState<WPMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMembers() {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Loading confreres in formation data...');
        const allMembers = await fetchConfreresInFormation();
        console.log(`👥 Loaded ${allMembers.length} confreres in formation`);

        setMembers(allMembers);
      } catch (err) {
        console.error('❌ Error loading confreres in formation:', err);
        setError('Failed to load confreres in formation data');
      } finally {
        setLoading(false);
      }
    }

    void loadMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading confreres in formation...</p>
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
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Confreres in Formation</h1>
        <p className="mt-2 text-gray-600">
          Browse and manage confreres in formation: novices, scholastics, and brothers.
        </p>
      </div>

      <ConfreresTable members={members} />
    </div>
  );
}