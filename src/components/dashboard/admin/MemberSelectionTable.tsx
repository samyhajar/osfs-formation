import Image from 'next/image';
import type { WPMember } from '@/lib/wordpress/types';

interface MemberSelectionTableProps {
  members: WPMember[];
  selectedMemberIds: number[];
  onMemberToggle: (memberId: number) => void;
  title: string;
}

export default function MemberSelectionTable({
  members,
  selectedMemberIds,
  onMemberToggle,
  title
}: MemberSelectionTableProps) {
  // Helper function to get member info including profile picture
  const getMemberInfo = (member: WPMember) => {
    const positions = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'position')
      .map(term => term.name) || ['No position'];

    const province = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'province')
      .map(term => term.name)[0] || 'No province';

    // Get profile picture URL
    const profileImage = member._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
    const memberName = member.title?.rendered || member.name || `Member ${member.id}`;
    const altText = member._embedded?.['wp:featuredmedia']?.[0]?.alt_text || memberName;

    return {
      positions: positions.join(', '),
      province,
      profileImage,
      altText,
      memberName
    };
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {title} ({members.length})
      </h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Province
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formation Position(s)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map((member) => {
                const { positions, province, profileImage, altText, memberName } = getMemberInfo(member);
                const isSelected = selectedMemberIds.includes(member.id);

                return (
                  <tr key={member.id} className={isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onMemberToggle(member.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        {profileImage ? (
                          <Image
                            className="w-full h-full object-contain"
                            src={profileImage}
                            alt={altText}
                            width={48}
                            height={48}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full flex items-center justify-center text-sm font-medium text-gray-600 ${profileImage ? 'hidden' : 'flex'}`}
                          style={{ display: profileImage ? 'none' : 'flex' }}
                        >
                          {memberName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {memberName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {member.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{province}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{positions}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}