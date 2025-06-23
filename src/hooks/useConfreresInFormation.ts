import useSWR from 'swr';
import { fetchConfreresInFormation } from '@/lib/wordpress/api';
import type { WPMember } from '@/lib/wordpress/types';

const CONFRERES_IN_FORMATION_KEY = '/wordpress/confreres-in-formation';

/**
 * Custom hook for fetching confreres in formation with SWR caching
 * Provides stale-while-revalidate functionality for better UX
 */
export function useConfreresInFormation() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<WPMember[]>(
    CONFRERES_IN_FORMATION_KEY,
    fetchConfreresInFormation,
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
        console.error('❌ Confreres in Formation fetch error:', error);
      },
      onSuccess: (data) => {
        console.log(
          `✅ Confreres in Formation loaded: ${data?.length || 0} members`,
        );
      },
    },
  );

  return {
    members: data || [],
    loading: isLoading,
    error: error ? 'Failed to load confreres in formation data' : null,
    refetch: mutate,
    isEmpty: !isLoading && (!data || data.length === 0),
    isRefreshing: isValidating && !isLoading, // Background refresh indicator
  };
}
