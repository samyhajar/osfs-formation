import { NextResponse } from 'next/server';
import { fetchMembers } from '@/lib/wordpress/api';

interface MemberImage {
  memberId: number;
  name: string;
  imageUrl: string;
  alt: string;
  width?: number;
  height?: number;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const memberIds = url.searchParams.get('ids')?.split(',').map(Number);

    if (!memberIds || memberIds.length === 0) {
      return NextResponse.json(
        { error: 'Member IDs are required' },
        { status: 400 },
      );
    }

    // Fetch all members with embedded media
    const members = await fetchMembers();

    // Filter for requested members and extract their images
    const memberImages = memberIds
      .map((id) => {
        const member = members.find((m) => m.id === id);
        if (!member) {
          console.log(`Member not found: ${id}`);
          return null;
        }

        // Get the featured media from _embedded
        const featuredMedia = member._embedded?.['wp:featuredmedia']?.[0];
        if (!featuredMedia) {
          console.log(`No featured media for member: ${id}`);
          return null;
        }

        // Get the best available image size (prefer medium for performance)
        const imageUrl =
          featuredMedia.media_details?.sizes?.medium?.source_url ||
          featuredMedia.media_details?.sizes?.full?.source_url ||
          featuredMedia.source_url;

        if (!imageUrl) {
          console.log(`No image URL found for member: ${id}`);
          return null;
        }

        const image: MemberImage = {
          memberId: member.id,
          name: member.title?.rendered || '',
          imageUrl,
          alt: featuredMedia.alt_text || member.title?.rendered || '',
          width:
            featuredMedia.media_details?.sizes?.medium?.width ||
            featuredMedia.media_details?.width,
          height:
            featuredMedia.media_details?.sizes?.medium?.height ||
            featuredMedia.media_details?.height,
        };

        console.log(`Successfully found image for member: ${id}`);
        return image;
      })
      .filter(Boolean); // Remove null entries

    console.log(
      `Found images for ${memberImages.length} out of ${memberIds.length} members`,
    );

    return NextResponse.json({
      success: true,
      images: memberImages,
      summary: {
        totalRequested: memberIds.length,
        totalFound: memberImages.length,
      },
    });
  } catch (error) {
    console.error('Error fetching member images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member images' },
      { status: 500 },
    );
  }
}
