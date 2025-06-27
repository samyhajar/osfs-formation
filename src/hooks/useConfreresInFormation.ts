'use client';

import useSWR from 'swr';
import { createClient } from '@/lib/supabase/browser-client';
import type { Tables } from '@/types/supabase';
import type { WPMember } from '@/lib/wordpress/types';

type ConfrereRow = Tables<'confreres_in_formation'>;

const supabase = createClient();

/**
 * Hook to fetch confreres in formation from cached Supabase table.
 * Population of this table is handled by the daily Vercel cron job that hits
 * /api/sync/confreres-in-formation.
 */
export function useConfreresInFormation() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<WPMember[]>(
    'confreres_in_formation',
    async () => {
      const { data, error } = await supabase
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore – table might not yet exist in generated types immediately after migrations
        .from('confreres_in_formation')
        .select('*')
        .order('name');

      if (error) throw error;

      const rows = (data ?? []) as ConfrereRow[];

      const mapped = rows
        .map((row, idx) => {
          const provinceName = (row as Record<string, unknown>).province as
            | string
            | undefined;

          const positionsArr = row.positions as unknown as
            | { province: string }[]
            | null;

          const resolvedProvince = provinceName
            ? provinceName
            : positionsArr && positionsArr.length > 0
            ? positionsArr[0].province
            : 'Unknown Province';

          const stateId = idx * 2 + 1;
          const provinceId = idx * 2 + 2;

          if (resolvedProvince.toLowerCase().includes('unknown')) return null;

          return {
            id: row.wp_id,
            slug: row.slug,
            title: { rendered: row.name },
            state: [stateId],
            province: [provinceId],
            meta: { email: row.email || '' },
            _embedded: {
              'wp:term': [
                [{ id: stateId, name: row.status, taxonomy: 'state' }],
                [
                  {
                    id: provinceId,
                    name: resolvedProvince,
                    taxonomy: 'province',
                  },
                ],
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
