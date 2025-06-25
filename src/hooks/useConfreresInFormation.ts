import useSWR from 'swr';
import type { WPMember } from '@/lib/wordpress/types';

const CONFRERES_IN_FORMATION_ENDPOINT = '/api/confreres-in-formation';

interface APIResponse {
  success: boolean;
  data: WPMember[];
  count: number;
  durationMs: number;
  timestamp: string;
}

/**
 * Custom hook for fetching confreres in formation with SWR caching
 * Provides stale-while-revalidate functionality for better UX
 */
export function useConfreresInFormation() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<APIResponse>(
    CONFRERES_IN_FORMATION_ENDPOINT,
    async () => {
      const res = await fetch(CONFRERES_IN_FORMATION_ENDPOINT);
      if (!res.ok) throw new Error('Failed to fetch confreres in formation');
      return res.json();
    },
    {
      // Cache for 5 minutes, then revalidate in background
      dedupingInterval: 5 * 60 * 1000,
      // Revalidate every 10 minutes
      refreshInterval: 10 * 60 * 1000,
      // Revalidate when window gets focus
      revalidateOnFocus: true,
      // Revalidate when network reconnects
      revalidateOnReconnect: true,
      // Keep previous data while loading new data
      keepPreviousData: true,
      // Fallback to cache when offline
      fallbackData: undefined,
      // Error retry configuration
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('❌ Confreres in Formation fetch error:', err);
      },
      onSuccess: (response) => {
        console.log(
          `✅ Confreres in Formation loaded: ${
            response?.data?.length || 0
          } members`,
        );

        // 🔍 CLIENT-SIDE DEBUG: Analyze the received data
        if (response && response.data && response.data.length > 0) {
          console.log(
            '🔍 CLIENT-SIDE DEBUG: Analyzing received member data...',
          );

          // Sample first few members to understand structure
          console.log('📋 Sample members (first 3):');
          response.data.slice(0, 3).forEach((member, index) => {
            console.log(
              `--- Member ${index + 1}: ${member.title.rendered} ---`,
            );
            console.log('Member ID:', member.id);
            console.log('State IDs:', member.state);
            console.log('Province IDs:', member.province);

            if (member._embedded?.['wp:term']) {
              const allTerms = member._embedded['wp:term'].flat();
              const stateTerms = allTerms.filter(
                (term) =>
                  (member.state ?? []).includes(term.id) &&
                  term.taxonomy === 'state',
              );

              console.log(
                'State terms for this member:',
                stateTerms.map((term) => ({
                  id: term.id,
                  name: term.name,
                  taxonomy: term.taxonomy,
                })),
              );
            }
            console.log('---');
          });

          // Analyze all status terms found
          const allStatusTerms = new Set<string>();
          const statusBreakdown: Record<string, string[]> = {};

          response.data.forEach((member) => {
            if (member._embedded?.['wp:term']) {
              const allTerms = member._embedded['wp:term'].flat();
              const stateTerms = allTerms.filter(
                (term) =>
                  (member.state ?? []).includes(term.id) &&
                  term.taxonomy === 'state',
              );

              stateTerms.forEach((term) => {
                allStatusTerms.add(term.name);

                if (!statusBreakdown[term.name]) {
                  statusBreakdown[term.name] = [];
                }
                statusBreakdown[term.name].push(member.title.rendered);
              });
            }
          });

          console.log(
            '📊 ALL STATUS TERMS FOUND:',
            Array.from(allStatusTerms).sort(),
          );
          console.log('📈 STATUS BREAKDOWN:');
          Object.entries(statusBreakdown).forEach(([status, members]) => {
            console.log(`  ${status}: ${members.length} members`);
            if (members.length <= 5) {
              members.forEach((name) => console.log(`    - ${name}`));
            } else {
              members
                .slice(0, 3)
                .forEach((name) => console.log(`    - ${name}`));
              console.log(`    ... and ${members.length - 3} more`);
            }
          });

          // Check for potentially deceased members
          const potentiallyDeceasedTerms = Array.from(allStatusTerms).filter(
            (term) => {
              const lowerTerm = term.toLowerCase();
              return (
                lowerTerm.includes('deceased') ||
                lowerTerm.includes('dead') ||
                lowerTerm.includes('†') ||
                lowerTerm.includes('rip') ||
                lowerTerm.includes('former') ||
                lowerTerm.includes('retired')
              );
            },
          );

          if (potentiallyDeceasedTerms.length > 0) {
            console.log(
              '⚰️ POTENTIALLY DECEASED STATUS TERMS FOUND:',
              potentiallyDeceasedTerms,
            );
            potentiallyDeceasedTerms.forEach((term) => {
              if (statusBreakdown[term]) {
                console.log(
                  `  ${term}: ${statusBreakdown[term].length} members`,
                );
                statusBreakdown[term]
                  .slice(0, 5)
                  .forEach((name) => console.log(`    - ${name}`));
              }
            });
          } else {
            console.log(
              '✅ No obviously deceased status terms found in current data',
            );
          }

          // Check for our target statuses
          const targetStatuses = [
            'Postulant',
            'Novice',
            'Bro. Novice',
            'Scholastic',
            'Deacon',
          ];
          const foundTargetStatuses = targetStatuses.filter((status) =>
            allStatusTerms.has(status),
          );
          const missingTargetStatuses = targetStatuses.filter(
            (status) => !allStatusTerms.has(status),
          );

          console.log('🎯 TARGET STATUS CHECK:');
          console.log('  Found:', foundTargetStatuses);
          console.log('  Missing:', missingTargetStatuses);

          // Look for similar status terms that might be variations
          const similarTerms = Array.from(allStatusTerms).filter((term) => {
            const lowerTerm = term.toLowerCase();
            return (
              lowerTerm.includes('postulant') ||
              lowerTerm.includes('novice') ||
              lowerTerm.includes('scholastic') ||
              lowerTerm.includes('deacon') ||
              lowerTerm.includes('brother')
            );
          });

          if (similarTerms.length > 0) {
            console.log('🔍 SIMILAR FORMATION-RELATED TERMS:', similarTerms);
          }
        }
      },
    },
  );

  return {
    members: data?.data || [],
    loading: isLoading,
    error: error ? 'Failed to load confreres in formation data' : null,
    refetch: mutate,
    isEmpty: !isLoading && (!data?.data || data.data.length === 0),
    isRefreshing: isValidating && !isLoading, // Background refresh indicator
  };
}
