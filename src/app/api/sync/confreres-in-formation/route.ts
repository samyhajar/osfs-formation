import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  fetchMembers,
  fetchPositions,
  fetchProvinces,
} from '@/lib/wordpress/api';
import type { WPTerm } from '@/lib/wordpress/types';
import type { Json } from '@/types/supabase';

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

/** WordPress meta response shape */
interface MemberMetaResponse {
  meta: Record<string, unknown>;
  image: string | null;
  title: string;
  slug: string;
  id: number;
}

/** Parse raw meta to structured fields */
function parseMeta(meta: Record<string, unknown>) {
  const positionsCount = meta.positions
    ? parseInt(meta.positions as string)
    : 0;
  const positions: Array<{
    position: number | null;
    province: number | null;
    from: string;
    to: string;
  }> = [];
  for (let i = 0; i < positionsCount; i++) {
    positions.push({
      position: meta[`positions_${i}_position`]
        ? parseInt(meta[`positions_${i}_position`] as string)
        : null,
      province: meta[`positions_${i}_province`]
        ? parseInt(meta[`positions_${i}_province`] as string)
        : null,
      from: (meta[`positions_${i}_from`] as string) || '',
      to: (meta[`positions_${i}_to`] as string) || '',
    });
  }

  const deceasedRaw = meta['deceased'];
  const deceasedFlag = Array.isArray(deceasedRaw)
    ? deceasedRaw[0] === '1'
    : deceasedRaw === '1';

  return {
    email: (meta['e-mail'] as string) || '',
    deceased: deceasedFlag,
    positions,
  };
}

async function fetchMeta(memberId: number) {
  const endpoint = `https://wordpress-635146-5283628.cloudwaysapps.com/wp-json/custom/v1/member-meta/${memberId}`;
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

interface PositionDetailed {
  position: string;
  province: string;
  from: string;
  to: string;
  isActive: boolean;
}

export async function POST() {
  const start = Date.now();

  const [members, allPositions, allProvinces] = await Promise.all([
    fetchMembers(),
    fetchPositions(),
    fetchProvinces(),
  ]);

  type ConfrereInFormationRow = {
    wp_id: number;
    name: string;
    slug: string;
    email: string | null;
    profile_image: string | null;
    bio: string;
    deceased: boolean;
    status: string;
    positions: Json;
    total_active: number;
    last_synced: string;
  };

  const rows: ConfrereInFormationRow[] = [];

  for (const member of members) {
    // Determine if member has a formation status taxonomy term
    const terms = member._embedded?.['wp:term']?.flat() || [];
    const formationTerm = terms.find(
      (t) =>
        (member.state || []).includes(t.id) &&
        t.taxonomy === 'state' &&
        FORMATION_STATUSES.includes(t.name),
    );
    if (!formationTerm) continue;

    const meta = await fetchMeta(member.id);
    if (!meta || meta.deceased) continue; // skip if failed or deceased

    const positionsDetailed: PositionDetailed[] = (meta.positions || []).map(
      (p) => {
        const pos = allPositions.find((x: WPTerm) => x.id === p.position);
        const prov = allProvinces.find((x: WPTerm) => x.id === p.province);
        return {
          position: pos?.name || `Unknown Position (${p.position})`,
          province: prov?.name || `Unknown Province (${p.province})`,
          from: p.from,
          to: p.to,
          isActive: !p.to || p.to.trim() === '',
        };
      },
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
      positions: positionsDetailed as unknown as Json,
      total_active: positionsDetailed.filter((p) => p.isActive).length,
      last_synced: new Date().toISOString(),
    });
  }

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

  return NextResponse.json({
    success: true,
    rows: rows.length,
    durationMs: Date.now() - start,
  });
}
