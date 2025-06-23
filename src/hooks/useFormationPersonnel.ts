import useSWR from 'swr';
import { fetchFormationUsers } from '@/lib/wordpress/api';
import type { WPMember } from '@/lib/wordpress/types';

const FORMATION_PERSONNEL_KEY = '/wordpress/formation-personnel';

/**
 * Custom hook for fetching formation personnel with SWR caching
 * Provides stale-while-revalidate functionality for better UX
 */
export function useFormationPersonnel() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<WPMember[]>(
    FORMATION_PERSONNEL_KEY,
    fetchFormationUsers,
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
      onError: (error) => {
        console.error('❌ Formation Personnel fetch error:', error);
      },
      onSuccess: (data) => {
        console.log(
          `✅ Formation Personnel loaded: ${data?.length || 0} members`,
        );
      },
    },
  );

  return {
    formationPersonnel: data || [],
    loading: isLoading,
    error: error ? 'Failed to load formation personnel' : null,
    refetch: mutate,
    isEmpty: !isLoading && (!data || data.length === 0),
    isRefreshing: isValidating && !isLoading, // Background refresh indicator
  };
}
