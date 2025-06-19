'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { getFormationSettings } from '@/lib/supabase/formation-settings';
import { fetchLeadershipFormationMembers } from '@/lib/wordpress/api';
import type { WPMember } from '@/lib/wordpress/types';
import MemberCard from '@/components/user/formation-personnel/MemberCard';

const SELECTED_MEMBERS_KEY = 'selectedFormationMembers';

export default function UserFormationPersonnelPage() {
  const locale = useLocale();
  const [selectedMembers, setSelectedMembers] = useState<WPMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSelectedMembers() {
      try {
        setLoading(true);
        setError(null);

        // Get selected member IDs from database
        const selectedIds = await getFormationSettings();
        console.log(`📋 Found ${selectedIds.length} selected member IDs in database`);

        // Fetch all formation members
        const allMembers = await fetchLeadershipFormationMembers();
        console.log(`👥 Loaded ${allMembers.length} total formation members from WordPress API`);

        // Fallback to localStorage if database is empty
        let finalSelectedIds = selectedIds;
        if (selectedIds.length === 0) {
          const saved = localStorage.getItem(SELECTED_MEMBERS_KEY);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed)) {
                finalSelectedIds = parsed;
              }
            } catch (e) {
              console.error('Error parsing localStorage:', e);
            }
          }
        }

        // Filter to get only selected members
        const selected = allMembers.filter(member =>
          finalSelectedIds.includes(member.id)
        );

        setSelectedMembers(selected);
      } catch (err) {
        console.error('Error loading formation personnel:', err);
        setError('Failed to load formation personnel');
      } finally {
        setLoading(false);
      }
    }

    void loadSelectedMembers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading formation personnel...</p>
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
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Leadership Formation Personnel
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Meet our dedicated formation leaders who guide and support the spiritual and academic development
          of our seminarians and candidates throughout their journey of discernment and preparation for religious life.
        </p>
      </div>

      {selectedMembers.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Formation Personnel Selected</h3>
          <p className="text-gray-600">
            The formation personnel directory is currently being updated. Please check back soon.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {selectedMembers.map((member) => (
            <MemberCard key={member.id} member={member} locale={locale} />
          ))}
        </div>
      )}

      {/* Footer Note */}
      {selectedMembers.length > 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            For more information about our formation programs or to contact any of our formation personnel,
            please reach out to your local community or provincial office.
          </p>
        </div>
      )}
    </div>
  );
}