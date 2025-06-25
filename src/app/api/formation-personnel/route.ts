import { writeFileSync } from 'fs';
import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import {
  fetchMembers,
  fetchPositions,
  fetchProvinces,
} from '@/lib/wordpress/api';
import { WPMember, WPTerm } from '@/lib/wordpress/types';

const WP_API_USER = process.env.WORDPRESS_API_USER;
const WP_API_PASSWORD = process.env.WORDPRESS_API_PASSWORD;
const basicAuth = Buffer.from(`${WP_API_USER}:${WP_API_PASSWORD}`).toString(
  'base64',
);

interface PositionEntryRaw {
  position: number | null;
  province: number | null;
  from: string;
  to: string;
}

interface ParsedACFMeta {
  positions: PositionEntryRaw[];
  bio: string;
  email: string;
  deceased: boolean;
}

function parseWordPressMetaToACF(
  meta: Record<string, unknown>,
): ParsedACFMeta | null {
  const positionsCount = meta.positions
    ? parseInt(meta.positions as string)
    : 0;
  if (positionsCount === 0) return null;

  const positions: PositionEntryRaw[] = [];
  for (let i = 0; i < positionsCount; i++) {
    const position = {
      position: meta[`positions_${i}_position`]
        ? parseInt(meta[`positions_${i}_position`] as string)
        : null,
      province: meta[`positions_${i}_province`]
        ? parseInt(meta[`positions_${i}_province`] as string)
        : null,
      from: (meta[`positions_${i}_from`] as string) || '',
      to: (meta[`positions_${i}_to`] as string) || '',
    };
    if (position.position) positions.push(position);
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

async function fetchMetaFieldsDirectly(
  memberId: number,
): Promise<{ meta: Record<string, unknown>; image: string | null } | null> {
  const endpoint = `https://wordpress-635146-5283628.cloudwaysapps.com/wp-json/custom/v1/member-meta/${memberId}`;
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
  } catch (error) {
    console.error(`Failed to fetch meta for member ${memberId}:`, error);
  }
  return null;
}

export async function GET() {
  const start = Date.now();

  // Step 1: Fetch all data
  const [members, allPositions, allProvinces] = await Promise.all([
    fetchMembers(),
    fetchPositions(),
    fetchProvinces(),
  ]);

  // Define the target formation positions we're looking for
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

  // Step 2: Filter members who have any of the target positions (from taxonomy)
  const membersWithFormationPositions = members.filter(
    (member: WPMember & { position?: number[] }) => {
      const memberPositionIds = member.position || [];
      return memberPositionIds.some((positionId: number) => {
        const position = allPositions.find((p: WPTerm) => p.id === positionId);
        return position && targetPositions.includes(position.name);
      });
    },
  );

  console.log(
    `Found ${membersWithFormationPositions.length} members with target positions out of ${members.length} total members`,
  );

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

  const results: ActiveFormationMember[] = [];

  // Step 3: For each filtered member, check if alive and has active positions
  for (const member of membersWithFormationPositions) {
    const metaData = await fetchMetaFieldsDirectly(member.id);
    if (!metaData) continue;

    const acf = parseWordPressMetaToACF(metaData.meta);
    if (!acf) continue;

    // Step 4: Filter out deceased members
    if (acf.deceased) {
      console.log(`Skipping deceased member: ${member.title?.rendered}`);
      continue;
    }

    // Step 5: Get all position history and find active ones
    const allPositions_member: PositionDetailed[] = (acf.positions || []).map(
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
          isActive: !entry.to || entry.to.trim() === '', // Active if 'to' field is empty
          isTargetPosition:
            !!position && targetPositions.includes(position.name),
        };
      },
    );

    // Step 6: Only include members who have active target positions
    const activeTargetPositions = allPositions_member.filter(
      (pos) => pos.isActive && pos.isTargetPosition,
    );

    if (activeTargetPositions.length === 0) {
      console.log(`No active target positions for: ${member.title?.rendered}`);
      continue;
    }

    console.log(
      `✅ ${member.title?.rendered} has ${activeTargetPositions.length} active target positions`,
    );

    results.push({
      id: member.id,
      name: member.title?.rendered,
      slug: member.slug,
      email: acf.email || null,
      bio: acf.bio || '',
      deceased: acf.deceased,
      profileImage: metaData.image,
      activeTargetPositions,
      allPositions: allPositions_member,
      totalActivePositions: allPositions_member.filter((pos) => pos.isActive)
        .length,
    });
  }

  const duration = Date.now() - start;
  const file = 'public/formation-personnel.json';
  writeFileSync(file, JSON.stringify(results, null, 2));

  // Sort results by last name for console display
  const sortedResults = [...results].sort((a, b) => {
    const lastNameA = a.name?.split(' ').pop()?.toLowerCase() || '';
    const lastNameB = b.name?.split(' ').pop()?.toLowerCase() || '';
    return lastNameA.localeCompare(lastNameB);
  });

  console.log(
    `🎯 Final result: ${results.length} active formation personnel found in ${duration}ms`,
  );

  console.log('\n📋 ACTIVE FORMATION PERSONNEL (sorted by last name):');
  console.log('='.repeat(80));

  sortedResults.forEach((member, index) => {
    const positions = member.activeTargetPositions
      .map((pos) => `${pos.position} (${pos.from}→)`)
      .join(', ');

    console.log(`${(index + 1).toString().padStart(2)}. ${member.name}`);
    console.log(`    Positions: ${positions}`);
    console.log(`    Email: ${member.email || 'N/A'}`);
    console.log('');
  });

  console.log('='.repeat(80));

  return NextResponse.json({
    success: true,
    data: results,
    summary: {
      totalMembers: members.length,
      membersWithTargetPositions: membersWithFormationPositions.length,
      aliveWithActivePositions: results.length,
      targetPositions,
    },
    file,
    durationMs: duration,
    timestamp: new Date().toISOString(),
  });
}
