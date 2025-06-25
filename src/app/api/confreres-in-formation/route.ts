import { writeFileSync } from 'fs';
import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import {
  fetchMembers,
  fetchProvinces,
  fetchPositions,
} from '@/lib/wordpress/api';
import type { WPMember, WPTerm } from '@/lib/wordpress/types';

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

function parseMeta(meta: Record<string, unknown>) {
  const positionsCount = meta.positions
    ? parseInt(meta.positions as string)
    : 0;
  const positions = [] as Array<{
    position: number | null;
    province: number | null;
    from: string;
    to: string;
  }>;
  for (let i = 0; i < positionsCount; i++) {
    const pos = {
      position: meta[`positions_${i}_position`]
        ? parseInt(meta[`positions_${i}_position`] as string)
        : null,
      province: meta[`positions_${i}_province`]
        ? parseInt(meta[`positions_${i}_province`] as string)
        : null,
      from: (meta[`positions_${i}_from`] as string) || '',
      to: (meta[`positions_${i}_to`] as string) || '',
    };
    if (pos.position) positions.push(pos);
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
    const data = (await res.json()) as { meta: Record<string, unknown> };
    return parseMeta(data.meta);
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

export async function GET() {
  const start = Date.now();

  const [members, positions, provinces] = await Promise.all([
    fetchMembers(),
    fetchPositions(),
    fetchProvinces(),
  ]);

  const results: WPMember[] = [];
  for (const member of members) {
    const terms = member._embedded?.['wp:term']?.flat() || [];
    const formationTerm = terms.find(
      (t) =>
        (member.state || []).includes((t).id) &&
        (t).taxonomy === 'state' &&
        FORMATION_STATUSES.includes((t).name),
    );
    if (!formationTerm) continue;

    const meta = await fetchMeta(member.id);
    if (!meta) continue;

    if (meta.deceased) {
      continue; // exclude deceased
    }

    // Attach email into meta for client util; ensure meta exists
    (member).meta = {
      ...(member.meta ?? {}),
      email: meta.email,
    } as WPMember['meta'];

    // Attach featured image so avatar helper works
    if ((member)._embedded == null)
      (member)._embedded = {} as unknown as typeof member._embedded;

    // Add positions/provinces array to member for potential future use
    (
      member as WPMember & {
        formationStatus?: string;
        positionsDetailed?: PositionDetailed[];
      }
    ).formationStatus = formationTerm.name;
    (
      member as WPMember & {
        formationStatus?: string;
        positionsDetailed?: PositionDetailed[];
      }
    ).positionsDetailed = (meta.positions || []).map((p) => {
      const pos = positions.find((x: WPTerm) => x.id === p.position);
      const prov = provinces.find((x: WPTerm) => x.id === p.province);
      return {
        position: pos?.name || `Unknown Position (${p.position})`,
        province: prov?.name || `Unknown Province (${p.province})`,
        from: p.from,
        to: p.to,
        isActive: !p.to || p.to.trim() === '',
      };
    }) as PositionDetailed[];

    results.push(member);
  }

  const duration = Date.now() - start;
  const file = 'public/confreres-in-formation.json';
  writeFileSync(file, JSON.stringify(results, null, 2));

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
    file,
    durationMs: duration,
    timestamp: new Date().toISOString(),
  });
}
