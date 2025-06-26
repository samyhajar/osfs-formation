import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  fetchMembers,
  fetchPositions,
  fetchProvinces,
} from '@/lib/wordpress/api';
import type { WPMember, WPTerm } from '@/lib/wordpress/types';
import type { Json } from '@/types/supabase';

/**
 * Detailed structure for each member returned from WordPress scrape.
 */
interface PositionDetailed {
  position: string;
  province: string;
  from: string;
  to: string;
  isActive: boolean;
  isTargetPosition: boolean;
}

interface ActiveFormationMember {
  id: number;
  name: string;
  slug: string;
  email: string | null;
  bio: string;
  deceased: boolean;
  profileImage: string | null;
  activeTargetPositions: PositionDetailed[];
  allPositions: PositionDetailed[];
  totalActivePositions: number;
}

/**
 * Helper to map WordPress raw meta fields to typed ACF values we need.
 */
function parseWordPressMetaToACF(meta: Record<string, unknown>): {
  positions: {
    position: number | null;
    province: number | null;
    from: string;
    to: string;
  }[];
  bio: string;
  email: string;
  deceased: boolean;
} | null {
  const positionsCount = meta.positions
    ? parseInt(meta.positions as string)
    : 0;
  if (positionsCount === 0) return null;

  const positions: {
    position: number | null;
    province: number | null;
    from: string;
    to: string;
  }[] = [];

  for (let i = 0; i < positionsCount; i++) {
    const entry = {
      position: meta[`positions_${i}_position`]
        ? parseInt(meta[`positions_${i}_position`] as string)
        : null,
      province: meta[`positions_${i}_province`]
        ? parseInt(meta[`positions_${i}_province`] as string)
        : null,
      from: (meta[`positions_${i}_from`] as string) || '',
      to: (meta[`positions_${i}_to`] as string) || '',
    };
    if (entry.position) positions.push(entry);
  }

  return {
    positions,
    bio: (meta.about_his_life as string) || '',
    email: (meta['e-mail'] as string) || '',
    deceased: meta.deceased === '1' || false,
  };
}

interface MemberMetaResponse {
  meta: Record<string, unknown>;
  image: string | null;
  title: string;
  slug: string;
  id: number;
}

const WP_API_USER = process.env.WORDPRESS_API_USER;
const WP_API_PASSWORD = process.env.WORDPRESS_API_PASSWORD;
const basicAuth = Buffer.from(`${WP_API_USER}:${WP_API_PASSWORD}`).toString(
  'base64',
);

/** Fetch meta fields for a single WP member via custom API endpoint */
async function fetchMetaFieldsDirectly(
  memberId: number,
): Promise<{ meta: Record<string, unknown>; image: string | null } | null> {
  const endpoint = `https://intern.osfs.world/wp-json/custom/v1/member-meta/${memberId}`;
  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = (await response.json()) as MemberMetaResponse;
      if (data.meta && Object.keys(data.meta).length > 0) {
        const cleanMeta: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(data.meta)) {
          cleanMeta[key] = Array.isArray(value) ? value[0] : value;
        }
        return { meta: cleanMeta, image: data.image ?? null };
      }
    }
  } catch (err) {
    console.error(`Failed to fetch meta for member ${memberId}:`, err);
  }
  return null;
}

export async function POST() {
  const start = Date.now();

  // 1. Gather data from WordPress
  const [members, allPositions, allProvinces] = await Promise.all([
    fetchMembers(),
    fetchPositions(),
    fetchProvinces(),
  ]);

  const targetPositions = [
    'General Formation Coordinator',
    'Novice Master',
    'Assistant Novice Master',
    'Master of Scholastics',
    'Formation Assistant',
    'Formation Director',
    'Postulant Director',
    'Vocation Director',
    'Co-Vocation Director',
  ];

  // 2. Narrow members that have at least one target position taxonomy term
  const membersWithFormationPositions = members.filter(
    (member: WPMember & { position?: number[] }) => {
      const memberPositionIds = member.position || [];
      return memberPositionIds.some((positionId: number) => {
        const pos = allPositions.find((p: WPTerm) => p.id === positionId);
        return pos && targetPositions.includes(pos.name);
      });
    },
  );

  const results: ActiveFormationMember[] = [];

  // 3. Loop and prepare enriched data
  for (const member of membersWithFormationPositions) {
    const metaData = await fetchMetaFieldsDirectly(member.id);
    if (!metaData) continue;

    const acf = parseWordPressMetaToACF(metaData.meta);
    if (!acf) continue;

    if (acf.deceased) continue; // skip deceased

    const allPositionsMember: PositionDetailed[] = (acf.positions || []).map(
      (entry) => {
        const position = allPositions.find(
          (p: WPTerm) => p.id === entry.position,
        );
        const province = allProvinces.find(
          (p: WPTerm) => p.id === entry.province,
        );
        return {
          position: position?.name || `Unknown Position (${entry.position})`,
          province: province?.name || `Unknown Province (${entry.province})`,
          from: entry.from || '',
          to: entry.to || '',
          isActive: !entry.to || entry.to.trim() === '',
          isTargetPosition:
            !!position && targetPositions.includes(position.name),
        };
      },
    );

    const activeTargetPositions = allPositionsMember.filter(
      (pos) => pos.isActive && pos.isTargetPosition,
    );

    if (activeTargetPositions.length === 0) continue;

    results.push({
      id: member.id,
      name: member.title?.rendered,
      slug: member.slug,
      email: acf.email || null,
      bio: acf.bio || '',
      deceased: acf.deceased,
      profileImage: metaData.image,
      activeTargetPositions,
      allPositions: allPositionsMember,
      totalActivePositions: allPositionsMember.filter((p) => p.isActive).length,
    });
  }

  // 4. Upsert into Supabase
  const supabase = createAdminClient();

  // Define minimal row shape for type safety without editing generated types
  type FormationPersonnelRow = {
    wp_id: number;
    name: string;
    slug: string;
    email: string | null;
    profile_image: string | null;
    bio: string;
    deceased: boolean;
    positions: Json;
    active_positions: Json;
    total_active: number;
    last_synced: string;
  };

  // Row type that matches Supabase "Insert" expectations for upsert
  type FormationPersonnelInsert = FormationPersonnelRow;

  const payload: FormationPersonnelInsert[] = results.map((m) => ({
    wp_id: m.id,
    name: m.name,
    slug: m.slug,
    email: m.email,
    profile_image: m.profileImage,
    bio: m.bio,
    deceased: m.deceased,
    positions: m.allPositions as unknown as Json,
    active_positions: m.activeTargetPositions as unknown as Json,
    total_active: m.totalActivePositions,
    last_synced: new Date().toISOString(),
  }));

  // Use generic row type to avoid explicit any and maintain type safety
  const { error } = await supabase
    .from('formation_personnel')
    .upsert(payload, { onConflict: 'wp_id' });

  if (error) {
    console.error('Formation personnel upsert error', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    rows: payload.length,
    durationMs: Date.now() - start,
  });
}
