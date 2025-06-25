import { writeFileSync } from 'fs';
import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { fetchMembers, fetchProvinces } from '@/lib/wordpress/api';
import { WPMember } from '@/lib/wordpress/types';

const WP_API_USER = process.env.WORDPRESS_API_USER;
const WP_API_PASSWORD = process.env.WORDPRESS_API_PASSWORD;
const basicAuth = Buffer.from(`${WP_API_USER}:${WP_API_PASSWORD}`).toString(
  'base64',
);

async function fetchMemberMeta(memberId: number) {
  console.log(`📥 Fetching meta data for member ${memberId}...`);
  const endpoint = `https://wordpress-635146-5283628.cloudwaysapps.com/wp-json/custom/v1/member-meta/${memberId}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        `❌ Failed to fetch meta for member ${memberId}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched meta for member ${memberId}`);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching meta for member ${memberId}:`, error);
    return null;
  }
}

interface FormationMember {
  id: number;
  name: string;
  email?: string;
  positions: string[];
  province?: string;
  imageUrl?: string;
}

export async function GET() {
  const start = Date.now();
  console.log('🚀 Starting confreres in formation fetch...');

  // Step 1: Fetch all data
  console.log('📥 STEP 1: Fetching base data...');
  const [members, allProvinces] = await Promise.all([
    fetchMembers(),
    fetchProvinces(),
  ]);
  console.log(
    `✅ Fetched ${members.length} members, ${allProvinces.length} provinces`,
  );

  // Define the formation states we're looking for
  const formationStates = [
    'Postulant',
    'Novice',
    'Bro. Novice',
    'Scholastic',
    'Deacon',
  ];

  console.log('🎯 Formation states:', formationStates);

  // Step 2: Filter members who are in formation
  const confreresInFormation = members.filter((member: WPMember) => {
    if (!member._embedded?.['wp:term']) return false;

    const allTerms = member._embedded['wp:term'].flat();
    const stateTerms = allTerms.filter(
      (term) => member.state?.includes(term.id) && term.taxonomy === 'state',
    );

    return stateTerms.some((term) => formationStates.includes(term.name));
  });

  console.log(`✅ Found ${confreresInFormation.length} confreres in formation`);

  const results: FormationMember[] = [];

  // Step 3: Fetch detailed meta for each member
  console.log('📥 STEP 3: Fetching member details...');
  for (const member of confreresInFormation) {
    console.log(
      `\n👤 Processing member: ${member.title?.rendered} (ID: ${member.id})`,
    );

    const memberData = await fetchMemberMeta(member.id);
    if (!memberData) {
      console.log(
        `⚠️ No meta data found for ${member.title?.rendered}, skipping...`,
      );
      continue;
    }

    // Check if deceased
    if (memberData.meta?.deceased === '1') {
      console.log(
        `⚰️ Member ${member.title?.rendered} is deceased, skipping...`,
      );
      continue;
    }

    // Get member's state
    const state = member._embedded?.['wp:term']
      ?.flat()
      .find(
        (term) =>
          member.state?.includes(term.id) &&
          term.taxonomy === 'state' &&
          formationStates.includes(term.name),
      )?.name;

    // Get member's province
    const province = member._embedded?.['wp:term']
      ?.flat()
      .find(
        (term) =>
          member.province?.includes(term.id) && term.taxonomy === 'province',
      )?.name;

    // Get featured image URL if available
    const featuredImageUrl =
      member._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

    // Get positions from embedded terms
    const positions =
      member._embedded?.['wp:term']
        ?.flat()
        .filter((term) => term.taxonomy === 'position')
        .map((term) => term.name) || [];

    console.log(
      `✅ Adding ${member.title?.rendered} to results (${state} in ${
        province || 'Unknown Province'
      })`,
    );

    // Transform to FormationMember type
    results.push({
      id: member.id,
      name: member.title?.rendered || '',
      email: memberData.meta?.['e-mail'] || undefined,
      positions: positions,
      province: province || undefined,
      imageUrl: featuredImageUrl || undefined,
    });
  }

  const duration = Date.now() - start;
  const file = 'public/formation-personnel.json';
  writeFileSync(file, JSON.stringify(results, null, 2));

  // Sort results by last name for console display
  const sortedResults = [...results].sort((a, b) => {
    const lastNameA = a.name.split(' ').pop()?.toLowerCase() || '';
    const lastNameB = b.name.split(' ').pop()?.toLowerCase() || '';
    return lastNameA.localeCompare(lastNameB);
  });

  console.log(
    `\n🎯 Final result: ${results.length} confreres in formation found in ${duration}ms`,
  );
  console.log('\n📋 CONFRERES IN FORMATION (sorted by last name):');
  console.log('='.repeat(80));

  sortedResults.forEach((member, index) => {
    console.log(`${(index + 1).toString().padStart(2)}. ${member.name}`);
    console.log(`    Positions: ${member.positions.join(', ')}`);
    console.log(`    Province: ${member.province || 'Unknown'}`);
    console.log(`    Email: ${member.email || 'N/A'}`);
    console.log(`    Image: ${member.imageUrl || 'N/A'}`);
    console.log('');
  });

  console.log('='.repeat(80));

  return NextResponse.json({
    success: true,
    data: results,
    summary: {
      totalMembers: members.length,
      confreresInFormation: confreresInFormation.length,
      activeConfreres: results.length,
      formationStates,
    },
    file,
    durationMs: duration,
    timestamp: new Date().toISOString(),
  });
}
