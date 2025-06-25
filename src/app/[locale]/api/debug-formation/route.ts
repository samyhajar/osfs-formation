import { NextResponse } from 'next/server';
import { fetchMembers, fetchPositions } from '@/lib/wordpress/api';
import { WPMember, WPTerm } from '@/lib/wordpress/types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const memberId = url.searchParams.get('memberId');

  try {
    // Step 1: Fetch all data in parallel
    const [members, allPositions] = await Promise.all([
      fetchMembers(),
      fetchPositions(),
    ]);

    // If memberId is provided, filter for just that member
    const targetMembers = memberId
      ? members.filter((m: WPMember) => m.id === parseInt(memberId))
      : members;

    // Return detailed debug info
    return NextResponse.json({
      success: true,
      debug: {
        members: targetMembers.map((member: WPMember) => ({
          id: member.id,
          name: member.title?.rendered,
          positions:
            (
              member as WPMember & {
                position?: number[];
              }
            ).position || [],
          positionNames: (
            (
              member as WPMember & {
                position?: number[];
              }
            ).position || []
          ).map((posId: number) => {
            const pos = allPositions.find((p: WPTerm) => p.id === posId);
            return pos ? pos.name : `Unknown Position (${posId})`;
          }),
          raw: member,
        })),
        allPositions: allPositions.map((p: WPTerm) => ({
          id: p.id,
          name: p.name,
        })),
      },
    });
  } catch (error) {
    console.error('Error in formation personnel debug API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch debug information',
      },
      { status: 500 },
    );
  }
}
