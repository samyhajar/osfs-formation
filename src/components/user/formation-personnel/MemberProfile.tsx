import Image from 'next/image';
import type { WPMember } from '@/lib/wordpress/types';

interface MemberProfileProps {
  member: WPMember;
}

export default function MemberProfile({ member }: MemberProfileProps) {
  // Helper function to get member info including profile picture
  const getMemberInfo = (member: WPMember) => {
    // Get member name
    const memberName = member.title?.rendered || member.name || `Member ${member.id}`;

    const positions = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'position')
      .map(term => term.name) || ['Formation Personnel'];

    const provinces = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'province')
      .map(term => term.name) || [];

    const ministries = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'ministry')
      .map(term => term.name) || [];

    const states = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'state')
      .map(term => term.name) || [];

    // Get profile picture URL
    const profileImage = member._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
    const altText = member._embedded?.['wp:featuredmedia']?.[0]?.alt_text || memberName;

    // Get initials
    const initials = memberName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return {
      memberName,
      positions,
      provinces,
      ministries,
      states,
      profileImage,
      altText,
      initials
    };
  };

  const { memberName, positions, provinces, ministries, states, profileImage, altText, initials } = getMemberInfo(member);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-8 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
                {profileImage ? (
                  <Image
                    className="w-full h-full object-contain"
                    src={profileImage}
                    alt={altText}
                    width={160}
                    height={160}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-2xl font-medium">
                      {initials}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">{memberName}</h1>
              {positions.length > 0 && (
                <p className="text-lg text-gray-600 mb-4 font-medium">{positions[0]}</p>
              )}
              {provinces.length > 0 && (
                <div className="flex items-center justify-center md:justify-start text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {provinces.join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Positions & Roles */}
            <div className="space-y-8">
              {/* Positions */}
              {positions.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Positions & Responsibilities
                  </h3>
                  <div className="space-y-3">
                    {positions.map((position, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{position}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* States */}
              {states.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Formation Status
                  </h3>
                  <div className="space-y-2">
                    {states.map((state, index) => (
                      <span key={index} className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md mr-2 mb-2">
                        {state}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-8">
              {/* Ministries */}
              {ministries.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Ministry Areas
                  </h3>
                  <div className="space-y-3">
                    {ministries.map((ministry, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{ministry}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Contact
                </h3>
                <div className="text-gray-600 space-y-4">
                  <p>
                    For inquiries or to schedule a meeting, please contact through your local community or provincial office.
                  </p>
                  <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-700 font-medium">
                      Contact through official channels for proper communication protocols.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-2">Formation Guidance</p>
                  <p>This member is available to provide spiritual direction, formation guidance, and support throughout your journey of discernment and religious formation. Please reach out through proper channels when you need assistance or have questions about your formation path.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}