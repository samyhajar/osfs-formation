'use client';

import type { WPMember } from '@/lib/wordpress/types';

interface ConfrereAdditionalInfoProps {
  member: WPMember;
}

export default function ConfrereAdditionalInfo({ member }: ConfrereAdditionalInfoProps) {
  // Helper function to get all term names for a taxonomy
  const getAllTermNames = (taxonomyType: string, termIds: number[]): string[] => {
    if (!member._embedded?.['wp:term'] || termIds.length === 0) return [];

    const terms = member._embedded['wp:term'].flat();
    const matchingTerms = terms.filter(term =>
      termIds.includes(term.id) && term.taxonomy === taxonomyType
    );

    return matchingTerms.map(term => term.name);
  };

  const positions = getAllTermNames('position', member.position);
  const ministries = getAllTermNames('ministry', member.ministry);

  return (
    <>
      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positions */}
        <div>
          <h5 className="text-sm font-medium text-gray-900 mb-2">Positions/Residence</h5>
          <div className="space-y-1">
            {positions.length > 0 ? (
              positions.map((position, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded mr-2 mb-1"
                >
                  {position}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No positions listed</span>
            )}
          </div>
        </div>

        {/* Ministries */}
        <div>
          <h5 className="text-sm font-medium text-gray-900 mb-2">Ministries</h5>
          <div className="space-y-1">
            {ministries.length > 0 ? (
              ministries.map((ministry, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded mr-2 mb-1"
                >
                  {ministry}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No ministries listed</span>
            )}
          </div>
        </div>
      </div>

      {/* Meta Information */}
      <div className="border-t pt-4">
        <h5 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-500">Member ID:</span>
            <span className="ml-2 text-gray-900">{member.id}</span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Slug:</span>
            <span className="ml-2 text-gray-900">{member.slug}</span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Status:</span>
            <span className="ml-2 text-gray-900 capitalize">{member.status}</span>
          </div>
          <div>
            <span className="font-medium text-gray-500">Last Modified:</span>
            <span className="ml-2 text-gray-900">
              {new Date(member.modified).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* WordPress Link */}
      <div className="border-t pt-4">
        <a
          href={member.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
        >
          View on WordPress
          <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </>
  );
}