import useSWR from 'swr';
import { createClient } from '@/lib/supabase/browser-client';
import type { Json } from '@/types/supabase';
import type { FormationPersonnelMember } from '@/types/formation-personnel';

interface DBRow {
  wp_id: number;
  name: string;
  slug: string;
  email: string | null;
  bio: string;
  deceased: boolean;
  profile_image: string | null;
  active_positions: Json;
  positions: Json;
  total_active: number;
}

const supabase = createClient();

/**
 * React hook to read cached Formation Personnel data directly from Supabase.
 * Heavy WordPress scraping now occurs hourly via a cron-triggered sync route,
 * so the client only needs to read the lightweight table.
 */
export function useFormationPersonnel() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<
    FormationPersonnelMember[]
  >(
    'formation_personnel',
    async () => {
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore – table might not yet exist in generated types after fresh migration
        .from('formation_personnel')
        .select('*')
        .order('name');

      if (error) throw error;
      // Transform DB rows → FormationPersonnelMember
      const mapped = (data ?? []) as DBRow[];
      const transformed: FormationPersonnelMember[] = mapped.map((row) => ({
        id: row.wp_id,
        name: row.name,
        slug: row.slug,
        email: row.email,
        bio: row.bio,
        deceased: row.deceased,
        profileImage: row.profile_image,
        activeTargetPositions:
          row.active_positions as unknown as FormationPersonnelMember['activeTargetPositions'],
        allPositions:
          row.positions as unknown as FormationPersonnelMember['allPositions'],
        totalActivePositions: row.total_active ?? 0,
      }));
      return transformed;
    },
    {
      dedupingInterval: 60 * 1000, // 1 min cache
      refreshInterval: 0, // no auto refresh; cron updates hourly
      revalidateOnFocus: false,
      keepPreviousData: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('❌ Formation Personnel fetch error:', err);
      },
    },
  );

  return {
    formationPersonnel: data ?? [],
    loading: isLoading,
    error: error ? 'Failed to load formation personnel' : null,
    refetch: mutate,
    isEmpty: !isLoading && (data?.length ?? 0) === 0,
    isRefreshing: isValidating && !isLoading,
  };
}
