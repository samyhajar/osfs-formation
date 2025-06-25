import { NextResponse } from 'next/server';
import { Buffer } from 'buffer';
import { fetchMembers } from '@/lib/wordpress/api';

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

function firstVal(value: unknown): string {
  if (Array.isArray(value)) return value[0] as string;
  return (value as string) ?? '';
}

function parseMeta(meta: Record<string, unknown>) {
  const deceasedRaw = meta['deceased'];
  const deceasedFlag = Array.isArray(deceasedRaw)
    ? deceasedRaw[0] === '1'
    : deceasedRaw === '1';

  return {
    email: firstVal(meta['e-mail']),
    deceased: deceasedFlag,
  };
}

async function fetchMeta(memberId: number) {
  const url = `https://wordpress-635146-5283628.cloudwaysapps.com/wp-json/custom/v1/member-meta/${memberId}`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      console.warn(`⚠️ Meta fetch failed for ${memberId}: ${res.status}`);
      return null;
    }
    const data = (await res.json()) as MemberMetaResponse;
    return {
      ...parseMeta(data.meta),
      image: data.image || null,
    };
  } catch (e) {
    console.error('Meta fetch error', e);
    return null;
  }
}

interface DebugMemberResult {
  id: number;
  name: string;
  status: string;
  email: string;
  profileImage: string | null;
  meta: {
    email: string;
    deceased: boolean;
    image: string | null;
  };
}

export async function GET(request: Request) {
  const start = Date.now();

  // Allow quick single-member inspection via ?memberId=123
  const url = new URL(request.url);
  const memberIdParam = url.searchParams.get('memberId');
  if (memberIdParam) {
    const memberId = parseInt(memberIdParam, 10);
    if (Number.isNaN(memberId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid memberId query param' },
        { status: 400 },
      );
    }

    console.log('\n===================\n🔍 SINGLE MEMBER DEBUG MODE');
    console.log(`Fetching meta for member ID: ${memberId}`);

    const meta = await fetchMeta(memberId);
    console.log('🛠️  Raw meta response:', meta);

    return NextResponse.json({ success: true, memberId, meta });
  }

  console.log('\n===================\n🚀 CONFRERES DEBUG – BATCH MODEhhhhhh');

  // STEP 1: Fetch all members (to get IDs & taxonomy info)
  console.log('🔄 STEP 1: Fetching all members from WordPress list...');
  const members = await fetchMembers();
  console.log(`✅ ${members.length} members obtained`);

  // STEP 2: Filter by formation status terms present in state taxonomy
  console.log('🎯 STEP 2: Filtering by formation statuses', FORMATION_STATUSES);
  const candidates = members.filter((m) => {
    if (!m._embedded?.['wp:term'] || !m.state) return false;
    const terms = m._embedded['wp:term'].flat();
    return terms.some(
      (t) =>
        (m.state ?? []).includes(t.id) &&
        t.taxonomy === 'state' &&
        FORMATION_STATUSES.includes(t.name),
    );
  });
  console.log(`✅ ${candidates.length} candidates after status filter`);

  // STEP 3: Fetch meta for each candidate & filter out deceased
  const results: DebugMemberResult[] = [];
  const statusTally: Record<string, number> = {};
  FORMATION_STATUSES.forEach((s) => (statusTally[s] = 0));

  console.log('⚙️ STEP 3: Enriching with meta & excluding deceased');

  for (const member of candidates) {
    const meta = await fetchMeta(member.id);
    if (!meta) {
      console.log(`❌ No meta for ${member.id}`);
      continue;
    }

    console.log('📝 META', member.id, meta);

    const isDeceased = meta.deceased;
    if (isDeceased) {
      console.log(`⚰️ Excluding deceased: ${member.title.rendered}`);
      continue;
    }

    // Determine primary status term for reporting
    const terms = member._embedded?.['wp:term']?.flat() ?? [];
    const statusTerm = terms.find(
      (t) =>
        (member.state ?? []).includes(t.id) &&
        t.taxonomy === 'state' &&
        FORMATION_STATUSES.includes(t.name),
    );
    if (statusTerm) statusTally[statusTerm.name] += 1;

    results.push({
      id: member.id,
      name: member.title.rendered,
      status: statusTerm?.name ?? 'Unknown',
      email: meta.email,
      profileImage: meta.image,
      meta, // include raw meta for debugging purposes
    });
  }

  // STEP 4: Log status breakdown
  console.log('📊 STATUS BREAKDOWN');
  Object.entries(statusTally).forEach(([status, count]) =>
    console.log(`  • ${status}: ${count}`),
  );
  console.log(`💚 Living confreres in formation: ${results.length}`);

  const duration = Date.now() - start;
  console.log(`🏁 Completed in ${duration}ms`);

  return NextResponse.json({
    success: true,
    data: results,
    count: results.length,
    statusBreakdown: statusTally,
    durationMs: duration,
  });
}
