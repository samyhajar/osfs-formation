import type { WPMember } from '@/lib/wordpress/types';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/solid';

/**
 * Helper function to safely extract the first term name for a given taxonomy
 * from the _embedded data.
 */
function getTermName(member: WPMember, taxonomySlug: 'province' | 'state' | 'ministry' | 'position'): string | null {
  const termArray = member._embedded?.['wp:term']?.find(arr => arr[0]?.taxonomy === taxonomySlug);
  return termArray?.[0]?.name ?? null;
}

/**
 * Helper function to get the featured image URL.
 */
function getFeaturedImageUrl(member: WPMember): string | null {
  return member._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null;
}

interface MemberCardProps {
  member: WPMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  const name = member.title.rendered;
  const provinceName = getTermName(member, 'province');
  const stateName = getTermName(member, 'state');
  const positionName = getTermName(member, 'position');
  const imageUrl = getFeaturedImageUrl(member);

  // TODO: Add links to member detail page if needed (member.link?)

  return (
    <div className="group flex flex-col items-center text-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm transition-all duration-300 ease-in-out hover:shadow-md hover:border-gray-200">
      {/* Image */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden relative mb-4 ring-1 ring-gray-200 group-hover:ring-accent-primary/30 transition-all duration-300">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`Portrait of ${name}`}
            fill
            sizes="96px"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <UserIcon className="w-12 h-12 text-gray-300" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-accent-primary transition-colors duration-300">{name}</h2>
        {positionName && (
          <p className="text-sm text-accent-primary font-medium mb-1">{positionName}</p>
        )}
        {provinceName && (
          <p className="text-sm text-gray-600">{provinceName}</p>
        )}
        {stateName && (
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{stateName}</p>
        )}
      </div>

      {/* Optional Actions (Example) */}
      {/* <div className="ml-auto flex-shrink-0">
        <a href={member.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium text-white bg-accent-primary rounded-md hover:bg-accent-primary/90 transition-colors shadow-sm">
          View Profile
        </a>
      </div> */}
    </div>
  );
}