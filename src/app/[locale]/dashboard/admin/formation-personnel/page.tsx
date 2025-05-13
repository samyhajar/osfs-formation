'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { fetchPositions, fetchMembersByPosition } from '@/lib/wordpress/api';
import type { WPMember, WPTerm } from '@/lib/wordpress/types';
import MemberCard from '@/components/formation/MemberCard';
import MultiSelect from '@/components/ui/MultiSelect';

// Define the structure for grouping
interface PersonnelGroup {
  id: number;
  title: string;
  members: WPMember[];
}

// Key for localStorage to store selected positions
const SELECTED_POSITIONS_KEY = 'formationPersonnel_selectedPositions';

export default function AdminFormationPersonnelPage() {
  const t = useTranslations('AdminFormationPersonnelPage');

  const [positions, setPositions] = useState<WPTerm[]>([]);
  const [selectedPositionIds, setSelectedPositionIds] = useState<number[]>([]);
  const [_members, setMembers] = useState<WPMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [groupedPersonnel, setGroupedPersonnel] = useState<PersonnelGroup[]>([]);

  // Fetch positions on component mount
  useEffect(() => {
    async function loadPositions() {
      try {
        setIsLoading(true);
        const positionTerms = await fetchPositions();
        setPositions(positionTerms);

        // Try to load previously saved positions
        try {
          const savedPositions = localStorage.getItem(SELECTED_POSITIONS_KEY);
          if (savedPositions) {
            const parsedPositions = JSON.parse(savedPositions) as number[];
            if (Array.isArray(parsedPositions)) {
              setSelectedPositionIds(parsedPositions);
            }
          }
        } catch (e) {
          console.error('Failed to load saved positions:', e);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch positions:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setIsLoading(false);
      }
    }

    void loadPositions();
  }, []);

  // Fetch members when positions are selected
  useEffect(() => {
    async function loadMembersByPositions() {
      if (selectedPositionIds.length === 0) {
        setMembers([]);
        setGroupedPersonnel([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Save selected positions to localStorage for user page to access
        try {
          localStorage.setItem(SELECTED_POSITIONS_KEY, JSON.stringify(selectedPositionIds));
        } catch (e) {
          console.error('Failed to save selected positions:', e);
        }

        // Create an array to store the grouped personnel in order of selection
        const orderedGroups: PersonnelGroup[] = [];

        // Process positions in the order they were selected
        for (const positionId of selectedPositionIds) {
          // Find the position name
          const position = positions.find(p => p.id === positionId);
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
        console.error('Failed to fetch members:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setIsLoading(false);
      }
    }

    // Reset members list when reloading
    setMembers([]);
    void loadMembersByPositions();
  }, [selectedPositionIds, positions]);

  // Transform positions for MultiSelect component
  const positionOptions = positions.map(position => ({
    value: position.id,
    label: position.name
  }));

  return (
    <main>
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      <div className="mb-8">
        <MultiSelect
          id="position-select"
          label={t('selectPosition')}
          options={positionOptions}
          selectedValues={selectedPositionIds}
          onChange={(values) => setSelectedPositionIds(values as number[])}
          placeholder={t('selectPositionPrompt')}
          disabled={isLoading || positions.length === 0}
          className="mb-1"
        />
      </div>

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

      {!isLoading && !error && selectedPositionIds.length > 0 && groupedPersonnel.length === 0 && (
        <p className="text-gray-500">{t('emptyState')}</p>
      )}

      {!isLoading && !error && selectedPositionIds.length === 0 && (
        <p className="text-gray-500">{t('selectPositionInstruction')}</p>
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