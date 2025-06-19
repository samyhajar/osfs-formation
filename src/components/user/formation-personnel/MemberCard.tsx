import Link from 'next/link';
import Image from 'next/image';
import type { WPMember } from '@/lib/wordpress/types';

interface MemberCardProps {
  member: WPMember;
  locale: string;
}

export default function MemberCard({ member, locale }: MemberCardProps) {
  // Helper function to get member info including profile picture
  const getMemberInfo = (member: WPMember) => {
    const positions = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'position')
      .map(term => term.name) || ['Formation Personnel'];

    const province = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'province')
      .map(term => term.name)[0] || 'No province';

    // Get profile picture URL
    const profileImage = member._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
    const altText = member._embedded?.['wp:featuredmedia']?.[0]?.alt_text || member.title.rendered;

    return {
      positions,
      province,
      profileImage,
      altText
    };
  };

  const { positions, province, profileImage, altText } = getMemberInfo(member);

  return (
    <Link
      href={`/${locale}/dashboard/user/formation-personnel/${member.id}`}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col h-full"
    >
      {/* Profile Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        {profileImage ? (
          <Image
            className="w-full h-full object-contain"
            src={profileImage}
            alt={altText}
            width={192}
            height={192}
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`absolute inset-0 flex items-center justify-center text-4xl font-bold text-indigo-600 ${profileImage ? 'hidden' : 'flex'}`}
          style={{ display: profileImage ? 'none' : 'flex' }}
        >
          {member.title.rendered.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {member.title.rendered}
        </h3>

        {/* Province */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {province}
        </div>

        {/* Positions */}
        <div className="space-y-2 flex-1">
          {positions.map((position, index) => (
            <span
              key={index}
              className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mr-2 mb-2"
            >
              {position}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Formation Leadership
          </div>
          <div className="text-xs text-blue-600 font-medium">
            View Details →
          </div>
        </div>
      </div>
    </Link>
  );
}