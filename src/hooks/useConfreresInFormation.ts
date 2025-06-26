import useSWR from 'swr';
import { createClient } from '@/lib/supabase/browser-client';
import type { Tables } from '@/types/supabase';
import type { WPMember } from '@/lib/wordpress/types';

type ConfrereRow = Tables<'confreres_in_formation'>;

const supabase = createClient();

/**
 * Hook to fetch confreres in formation from cached Supabase table.
 * WordPress scraping now handled by hourly server-side cron.
 */
export function useConfreresInFormation() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<WPMember[]>(
    'confreres_in_formation' as const,
    async () => {
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore – table might not yet exist in generated types after fresh migration
        .from('confreres_in_formation')
        .select('*')
        .order('name');

      if (error) throw error;

      // Map rows to minimal WPMember-like objects consumed by ConfreresTable
      const rows = (data ?? []) as ConfrereRow[];
      const mapped = rows
        .map((row, idx) => {
          // Prefer the new `province` column if it exists (column was added 2025-06-26).
          // Fallback to the previous logic of reading the first province in the positions JSON.
          const provinceNameFromColumn = (row as Record<string, unknown>)
            .province as string | undefined;

          const positionsArr = row.positions as unknown as
            | { province: string }[]
            | null;

          const provinceName = provinceNameFromColumn
            ? provinceNameFromColumn
            : positionsArr && positionsArr.length > 0
            ? positionsArr[0].province
            : 'Unknown Province';

          const stateId = idx * 2 + 1; // fake unique ids per row
          const provinceId = idx * 2 + 2;

          // Exclude rows where province could not be determined
          if (provinceName.toLowerCase().includes('unknown')) return null;

          return {
            id: row.wp_id,
            slug: row.slug,
            // mimic WP shape
            title: { rendered: row.name },
            state: [stateId],
            province: [provinceId],
            meta: { email: row.email || '' },
            _embedded: {
              'wp:term': [
                [{ id: stateId, name: row.status, taxonomy: 'state' }],
                [{ id: provinceId, name: provinceName, taxonomy: 'province' }],
              ],
              'wp:featuredmedia': row.profile_image
                ? [
                    {
                      source_url: row.profile_image,
                    },
                  ]
                : [],
            },
          } as unknown as WPMember;
        })
        .filter(Boolean) as WPMember[];

      return mapped;
    },
    {
      dedupingInterval: 60 * 1000,
      refreshInterval: 0,
      revalidateOnFocus: false,
      keepPreviousData: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err) => {
        console.error('❌ Confreres in Formation fetch error:', err);
      },
    },
  );

  return {
    members: data ?? [],
    loading: isLoading,
    error: error ? 'Failed to load confreres in formation' : null,
    refetch: mutate,
    isEmpty: !isLoading && (data?.length ?? 0) === 0,
    isRefreshing: isValidating && !isLoading,
  };
}
