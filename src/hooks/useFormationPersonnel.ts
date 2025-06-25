import useSWR from 'swr';
import type { FormationPersonnelMember } from '@/types/formation-personnel';

const FORMATION_PERSONNEL_ENDPOINT = '/api/formation-personnel';

interface APIResponse {
  success: boolean;
  data: FormationPersonnelMember[];
  summary: {
    totalMembers: number;
    membersWithTargetPositions: number;
    aliveWithActivePositions: number;
    targetPositions: string[];
  };
  file: string;
  durationMs: number;
  timestamp: string;
}

/**
 * React hook to fetch the simplified "Formation Personnel" list that is
 * served from the local Next.js API route (`/api/formation-personnel`).
 *
 * The API route already performs all heavy WordPress filtering – the hook only
 * needs to retrieve the JSON and expose loading / error state through SWR.
 */
export function useFormationPersonnel() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<APIResponse>(
    FORMATION_PERSONNEL_ENDPOINT,
    async () => {
      const res = await fetch(FORMATION_PERSONNEL_ENDPOINT);
      if (!res.ok) {
        throw new Error('Failed to fetch formation personnel');
      }
      return res.json();
    },
    {
      // cache 5 min, refresh 10 min (same rhythm as before)
      dedupingInterval: 5 * 60 * 1000,
      refreshInterval: 10 * 60 * 1000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      keepPreviousData: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('❌ Formation Personnel fetch error:', err);
      },
      onSuccess: (response) => {
        console.log(
          `✅ Formation Personnel loaded: ${response.data.length} members`,
        );
        console.log('📊 Summary:', response.summary);
      },
    },
  );

  return {
    formationPersonnel: data?.data ?? [],
    loading: isLoading,
    error: error ? 'Failed to load formation personnel' : null,
    refetch: mutate,
    isEmpty: !isLoading && (!data?.data || data.data.length === 0),
    isRefreshing: isValidating && !isLoading,
    summary: data?.summary,
  };
}
