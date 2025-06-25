import useSWR from 'swr';
import { createClient } from '@/lib/supabase/browser-client';
import type { Database } from '@/types/supabase';

/**
 * Retrieves the number of pending user approvals.
 * Refreshes every minute so the indicator stays up-to-date while the admin is on the dashboard.
 */
export default function usePendingApprovals() {
  const fetcher = async () => {
    const supabase = createClient<Database>();
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', false);

    if (error) throw error;
    return count ?? 0;
  };

  const { data, error, isLoading } = useSWR('pendingApprovalsCount', fetcher, {
    refreshInterval: 60_000, // 1 minute
  });

  return {
    count: data ?? 0,
    isLoading,
    error,
  };
}
