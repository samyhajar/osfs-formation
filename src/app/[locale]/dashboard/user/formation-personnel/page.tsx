'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { fetchPositions, fetchMembersByPosition } from '@/lib/wordpress/api';
import type { WPMember, WPTerm } from '@/lib/wordpress/types';
import MemberCard from '@/components/formation/MemberCard';

// Define the structure for grouping
interface PersonnelGroup {
  id: number;
  title: string;
  members: WPMember[];
}

// Key for localStorage to get selected positions from admin/editor
const SELECTED_POSITIONS_KEY = 'formationPersonnel_selectedPositions';

export default function FormeeFormationPersonnelPage() {
  const t = useTranslations('AdminFormationPersonnelPage'); // Reusing the same translation keys

  const [_positions, setPositions] = useState<WPTerm[]>([]);
  const [_members, setMembers] = useState<WPMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedPersonnel, setGroupedPersonnel] = useState<PersonnelGroup[]>([]);

  // Load positions and members based on admin/editor selection
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        // First load all available positions
        const positionTerms = await fetchPositions();
        setPositions(positionTerms);

        // Get selected positions from localStorage (set by admin/editor)
        let selectedPositionIds: number[] = [];
        try {
          const savedPositions = localStorage.getItem(SELECTED_POSITIONS_KEY);
          if (savedPositions) {
            const parsedPositions = JSON.parse(savedPositions) as number[];
            if (Array.isArray(parsedPositions) && parsedPositions.length > 0) {
              // Use type assertion to ensure we're dealing with numbers
              selectedPositionIds = parsedPositions.map(id => Number(id));
            }
          }
        } catch (e) {
          console.error('Failed to load saved positions:', e);
        }

        if (selectedPositionIds.length === 0) {
          setIsLoading(false);
          return;
        }

        // Create an array to store the grouped personnel in order of selection
        const orderedGroups: PersonnelGroup[] = [];

        // Process positions in the order they were selected by admin/editor
        for (const positionId of selectedPositionIds) {
          // Find the position name
          const position = positionTerms.find(p => p.id === positionId);
          if (!position) continue;

          // Fetch members for this position
          const positionMembers = await fetchMembersByPosition(positionId);

          // Add this group to our ordered array
          orderedGroups.push({
            id: positionId,
            title: position.name,
            members: positionMembers
          });

          // Add members to the flat list of all members
          setMembers(prev => [...prev, ...positionMembers]);
        }

        setGroupedPersonnel(orderedGroups);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setIsLoading(false);
      }
    }

    void loadData();
  }, []);

  return (
    <main>
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">{t('errorPrefix')}</strong>
          <span className="block sm:inline"> {t('errorLoading')} {error}</span>
        </div>
      )}

      {!isLoading && !error && groupedPersonnel.length === 0 && (
        <p className="text-gray-500">{t('noPositionsSelected')}</p>
      )}

      {!isLoading && !error && groupedPersonnel.length > 0 && (
        <div className="space-y-10">
          {groupedPersonnel.map((group) => (
            <section key={group.id}>
              <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b border-gray-200 pb-2">{group.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}