'use client';

import type { WPMember } from '@/lib/wordpress/types';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/outline';

interface ConfrereProfileProps {
  member: WPMember;
}

export default function ConfrereProfile({ member }: ConfrereProfileProps) {
  // Helper function to get term name by ID from embedded data
  const getTermName = (taxonomyType: string, termIds: number[]): string => {
    if (!member._embedded?.['wp:term'] || termIds.length === 0) return 'Unknown';

    const terms = member._embedded['wp:term'].flat();
    const matchingTerm = terms.find(term =>
      termIds.includes(term.id) && term.taxonomy === taxonomyType
    );

    return matchingTerm?.name || 'Unknown';
  };

  // Helper function to get featured image URL
  const getFeaturedImageUrl = (): string | null => {
    if (!member._embedded?.['wp:featuredmedia']?.[0]) return null;
    return member._embedded['wp:featuredmedia'][0].source_url || null;
  };

  const imageUrl = getFeaturedImageUrl();
  const status = getTermName('state', member.state);
  const province = getTermName('province', member.province);

  return (
    <div className="flex items-start space-x-6">
      <div className="flex-shrink-0">
        <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={member.title.rendered}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <UserIcon className="h-12 w-12 text-gray-400" />
          )}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="text-xl font-semibold text-gray-900 mb-2">
          {member.title.rendered}
        </h4>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500 w-20">Status:</span>
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {status}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-500 w-20">Province:</span>
            <span className="text-sm text-gray-900">{province}</span>
          </div>
        </div>
      </div>
    </div>
  );
}