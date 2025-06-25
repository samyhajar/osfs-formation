import type { WPMember } from '@/lib/wordpress/types';
import Image from 'next/image';

/**
 * Helper function to safely extract the first term name for a given taxonomy
 * from the _embedded data.
 */
function getTermName(member: WPMember, taxonomySlug: 'province' | 'state' | 'ministry' | 'position'): string | null {
  const termArray = member._embedded?.['wp:term']?.find(arr => arr[0]?.taxonomy === taxonomySlug);
  return termArray?.[0]?.name ?? null;
}

interface MemberCardProps {
  member: WPMember;
}

export default function MemberCard({ member }: MemberCardProps) {
  // Get member name
  const memberName = member.title?.rendered || member.name || `Member ${member.id}`;
  const provinceName = getTermName(member, 'province');
  const positionName = getTermName(member, 'position');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0">
          {member._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
            <Image
              src={member._embedded['wp:featuredmedia'][0].source_url}
              alt={member._embedded['wp:featuredmedia'][0].alt_text || memberName}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-lg font-medium">
                {memberName.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{memberName}</h3>
          {provinceName && (
            <p className="text-sm text-gray-500">{provinceName}</p>
          )}
        </div>
      </div>
      {positionName && (
        <div className="mt-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {positionName}
          </span>
        </div>
      )}
    </div>
  );
}