import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  fetchMembers,
  fetchPositions,
  fetchProvinces,
} from '@/lib/wordpress/api';
import type { Json } from '@/types/supabase';
import type { WPTerm } from '@/lib/wordpress/types';

const WP_API_USER = process.env.WORDPRESS_API_USER;
const WP_API_PASSWORD = process.env.WORDPRESS_API_PASSWORD;
const basicAuth = Buffer.from(`${WP_API_USER}:${WP_API_PASSWORD}`).toString(
  'base64',
);

const FORMATION_STATUSES = [
  'Postulant',
  'Novice',
  'Bro.Novice',
  'Bro. Novice',
  'Scholastic',
  'Deacon',
];

interface MemberMetaResponse {
  meta: Record<string, unknown>;
  image: string | null;
  title: string;
  slug: string;
  id: number;
}

function parseMeta(meta: Record<string, unknown>) {
  const deceasedRaw = meta['deceased'];
  const deceasedFlag = Array.isArray(deceasedRaw)
    ? deceasedRaw[0] === '1'
    : deceasedRaw === '1';

  const provinceId = Array.isArray(meta['province_of_residence'])
    ? parseInt(meta['province_of_residence'][0])
    : meta['province_of_residence']
    ? parseInt(meta['province_of_residence'] as string)
    : null;

  return {
    email: (meta['e-mail'] as string) || '',
    deceased: deceasedFlag,
    provinceId,
    positions: [], // Optional: skip for now
  };
}

async function fetchMeta(memberId: number) {
  const endpoint = `https://intern.osfs.world/wp-json/custom/v1/member-meta/${memberId}`;
  try {
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as MemberMetaResponse;
    return {
      ...parseMeta(data.meta),
      image: data.image ?? null,
    };
  } catch (e) {
    console.error(`Failed to fetch meta for member ${memberId}`, e);
    return null;
  }
}

export async function POST() {
  const start = Date.now();

  console.log('🚀 Starting confreres-in-formation sync');

  const [members, allPositions, allProvinces] = await Promise.all([
    fetchMembers(),
    fetchPositions(),
    fetchProvinces(),
  ]);

  console.log(
    `📥 Fetched ${members.length} members, ${allPositions.length} positions, and ${allProvinces.length} provinces from WordPress`,
  );

  type ConfrereInFormationRow = {
    wp_id: number;
    name: string;
    slug: string;
    email: string | null;
    profile_image: string | null;
    bio: string;
    deceased: boolean;
    status: string;
    province: string | null;
    positions: Json;
    total_active: number;
    last_synced: string;
  };

  interface MemberPositionRef {
    position: number | null;
  }

  const rows: ConfrereInFormationRow[] = [];
  // Track counts per formation status and per position for logging purposes
  const statusCounts: Record<string, number> = {};
  const positionCounts: Record<string, number> = {};

  for (const member of members) {
    const terms = member._embedded?.['wp:term']?.flat() || [];

    let formationTerm = terms.find(
      (t) =>
        (member.state || []).includes(t.id) &&
        t.taxonomy === 'state' &&
        FORMATION_STATUSES.includes(t.name),
    );

    // Fallback: try to detect formation status from position name if not in taxonomy
    const fallback =
      !formationTerm && member.meta?.positions
        ? (member.meta.positions as MemberPositionRef[]).find((p) => {
            const pos = allPositions.find((x) => x.id === p.position);
            return pos && FORMATION_STATUSES.includes(pos.name);
          })
        : null;

    if (fallback) {
      const pos = allPositions.find((x) => x.id === fallback.position);
      formationTerm = {
        name: pos?.name ?? 'Unknown',
        id: pos?.id ?? 0,
        taxonomy: 'position',
      } as unknown as WPTerm;

      console.log(
        `📌 Fallback status "${formationTerm.name}" via positions for member ${
          member.id
        }`,
      );
    }

    if (!formationTerm) {
      console.log(
        `⏭️  Skipping member ${member.id} – no formation status detected`,
      );
      continue;
    }

    const meta = await fetchMeta(member.id);
    if (!meta) {
      console.log(`⏭️  Skipping member ${member.id} – meta not found`);
      continue;
    }

    if (meta.deceased) {
      console.log(`☠️  Skipping member ${member.id} – marked deceased`);
      continue;
    }

    const currentProvince = meta.provinceId
      ? allProvinces.find((p) => p.id === meta.provinceId)?.name ?? null
      : null;

    // Increment count per formation status
    statusCounts[formationTerm.name] =
      (statusCounts[formationTerm.name] || 0) + 1;

    // Increment counts for each position found on the member (if any)
    if (member.meta?.positions && Array.isArray(member.meta.positions)) {
      (member.meta.positions as MemberPositionRef[]).forEach((p) => {
        const pos = allPositions.find((x) => x.id === p.position);
        if (pos) {
          positionCounts[pos.name] = (positionCounts[pos.name] || 0) + 1;
        }
      });
    }

    console.log(
      `📝 Preparing row for WP member ${member.id} – "${member.title?.rendered}" | Province: ${currentProvince}`,
    );

    rows.push({
      wp_id: member.id,
      name: member.title?.rendered,
      slug: member.slug,
      email: meta.email || null,
      profile_image: meta.image,
      bio: '',
      deceased: meta.deceased,
      status: formationTerm.name,
      province: currentProvince,
      positions: [], // Optional: could later include resolved positions
      total_active: 0,
      last_synced: new Date().toISOString(),
    });
  }

  // Log summary counts after processing all members
  console.log('📊 Formation status counts:', statusCounts);
  console.log('📊 Position counts:', positionCounts);

  const supabase = createAdminClient();
  const { error } = await supabase.from('confreres_in_formation').upsert(rows, {
    onConflict: 'wp_id',
  });

  if (error) {
    console.error('Confreres in formation upsert error', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  console.log(
    `✅ Sync complete. Inserted/updated ${rows.length} active members in ${
      Date.now() - start
    }ms`,
  );

  return NextResponse.json({
    success: true,
    rows: rows.length,
    statusCounts,
    positionCounts,
    durationMs: Date.now() - start,
  });
}
