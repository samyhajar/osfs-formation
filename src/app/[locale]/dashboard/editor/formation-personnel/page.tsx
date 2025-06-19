'use client';

import { useState, useEffect } from 'react';
import { fetchLeadershipFormationMembers } from '@/lib/wordpress/api';
import type { WPMember } from '@/lib/wordpress/types';
import { getFormationSettings } from '@/lib/supabase/formation-settings';
import Image from 'next/image';

// Key for localStorage fallback
const SELECTED_MEMBERS_KEY = 'formationPersonnel_selectedMembers';

export default function EditorFormationPersonnelPage() {
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

  // Helper function to get member info including profile picture
  const getMemberInfo = (member: WPMember) => {
    const positions = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'position')
      .map(term => term.name) || ['Formation Personnel'];

    const province = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'province')
      .map(term => term.name)[0] || 'No province';

    // Get profile picture URL
    const profileImage = member._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
    const altText = member._embedded?.['wp:featuredmedia']?.[0]?.alt_text || member.title.rendered;

    return {
      positions,
      province,
      profileImage,
      altText
    };
  };

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
          View and review our dedicated formation leaders who guide and support the spiritual and academic development
          of our seminarians and candidates throughout their journey of discernment and preparation for religious life.
        </p>
        <div className="mt-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg inline-block">
          <p className="text-sm text-blue-700">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Editor View - Contact admin to modify the formation personnel selection
          </p>
        </div>
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
            The formation personnel directory is currently being updated. Please contact an administrator to configure the selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {selectedMembers.map((member) => {
            const { positions, province, profileImage, altText } = getMemberInfo(member);

            return (
              <div key={member.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Profile Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100">
                  {profileImage ? (
                    <Image
                      className="w-full h-full object-cover"
                      src={profileImage}
                      alt={altText}
                      width={192}
                      height={192}
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`absolute inset-0 flex items-center justify-center text-4xl font-bold text-indigo-600 ${profileImage ? 'hidden' : 'flex'}`}
                    style={{ display: profileImage ? 'none' : 'flex' }}
                  >
                    {member.title.rendered.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {member.title.rendered}
                  </h3>

                  {/* Province */}
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {province}
                  </div>

                  {/* Positions */}
                  <div className="space-y-2">
                    {positions.map((position, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mr-2 mb-2"
                      >
                        {position}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Formation Leadership
                  </div>
                </div>
              </div>
            );
          })}
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