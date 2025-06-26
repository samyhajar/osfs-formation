import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  fetchMembers,
  fetchPositions,
  fetchProvinces,
} from '@/lib/wordpress/api';
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
    positions: [], // leave empty or extend later
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

  const [members, , allProvinces] = await Promise.all([
    fetchMembers(),
    fetchPositions(), // Still fetched in case needed later
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
    province: string | null;
    positions: Json;
    total_active: number;
    last_synced: string;
  };

  const rows: ConfrereInFormationRow[] = [];

  for (const member of members) {
    const terms = member._embedded?.['wp:term']?.flat() || [];
    const formationTerm = terms.find(
      (t) =>
        (member.state || []).includes(t.id) &&
        t.taxonomy === 'state' &&
        FORMATION_STATUSES.includes(t.name),
    );
    if (!formationTerm) continue;

    const meta = await fetchMeta(member.id);
    if (!meta || meta.deceased) continue;

    const currentProvince = meta.provinceId
      ? allProvinces.find((p) => p.id === meta.provinceId)?.name ?? null
      : null;

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
      positions: [], // Optional: if needed later
      total_active: 0,
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
