'use client';

import { useState, useMemo } from 'react';
import type { FormationPersonnelMember } from '@/types/formation-personnel';
import { openEmailClient } from '@/lib/utils/email';
import ConfreresPagination from '@/components/shared/confreres/ConfreresPagination';
import Image from 'next/image';

interface FormationPersonnelTableProps {
  members: FormationPersonnelMember[];
  onEmailSelected: (emails: string[]) => void;
}

const ITEMS_PER_PAGE = 20;

// Define the formation position hierarchy as specified by the user
const POSITION_HIERARCHY = [
  'General Formation Coordinator',
  'Novice Master',
  'Assistant Novice Master',
  'Master Of Scholastics',
  'Formation Assistant',
  'Formation Director',
  'Postulant Director',
  'Vocation Director',
  'Co-Vocation Director',
];

// Province order as specified - only show these provinces in this exact order
const ALLOWED_PROVINCES = [
  'France-West Africa Province',
  'Italian Province',
  'German Speaking Province',
  'Willmington/Philadelphia Province',
  'Toledo/Detroit Province',
  'South American And Caribbean Province',
  'Southern African Region',
  'Indian Region',
];

// Provinces to exclude from the dropdown (currently unused but kept for reference)
// const EXCLUDED_PROVINCES = [
//   'German Province',
//   'Keetmanshoop Region',
//   'No Province',
//   'The Swiss Province',
// ];

// Province name variations mapping
const provinceVariations: Record<string, string> = {
  'Austrian/South-German Province': 'German Speaking Province',
  'Philadelphia Province': 'Willmington/Philadelphia Province',
  'Detroit Province': 'Toledo/Detroit Province',
  'South American Province': 'South American And Caribbean Province',
  'Caribbean Province': 'South American And Caribbean Province',
};

export default function FormationPersonnelTable({
  members,
  onEmailSelected
}: FormationPersonnelTableProps) {
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [nameSort, setNameSort] = useState<'asc' | 'desc'>('asc');

  // Extract core information we need for display & filtering
  const getMemberInfo = (member: FormationPersonnelMember) => {
    const positions = member.activeTargetPositions.map((p) => p.position);

    // The simplified API already normalises provinces – use the first active position
    const provinceRaw = member.activeTargetPositions[0]?.province ?? 'No province';
    const normalizedProvince = provinceVariations[provinceRaw] || provinceRaw;

    const email = member.email ?? '';
    const profileImage = member.profileImage ?? null;

    return {
      positions,
      province: normalizedProvince,
      email,
      profileImage,
    };
  };

  // Helper function to format name as "Last Name, First Name"
  const formatNameLastFirst = (fullName: string): string => {
    const nameParts = fullName.trim().split(/\s+/);

    if (nameParts.length <= 1) {
      // If only one name part, return as is
      return fullName;
    }

    // Extract last name (last word) and first name(s) (everything else)
    const lastName = nameParts[nameParts.length - 1];
    const firstNames = nameParts.slice(0, -1).join(' ');

    return `${lastName}, ${firstNames}`;
  };

  // Helper function to extract last name for sorting
  const getLastName = (fullName: string): string => {
    const nameParts = fullName.trim().split(/\s+/);
    return nameParts[nameParts.length - 1] || fullName;
  };

  // Get provinces for filter with member counts - show ALL allowed provinces regardless of current members
  const availableProvinces = useMemo(() => {
    // Count members per province
    const provinceCounts: Record<string, number> = {};

    // Initialize all allowed provinces with 0 count
    ALLOWED_PROVINCES.forEach(province => {
      provinceCounts[province] = 0;
    });

    // Count actual members per province
    members.forEach(member => {
      const { province } = getMemberInfo(member);
      if (ALLOWED_PROVINCES.includes(province)) {
        provinceCounts[province] = (provinceCounts[province] || 0) + 1;
      }
    });

    // Return provinces with their counts
    return ALLOWED_PROVINCES.map(province => ({
      value: province,
      label: province,
      count: provinceCounts[province]
    }));
  }, [members]);

  // Get formation positions for filter with member counts - show ALL positions with counts
  const availablePositions = useMemo(() => {
    // Count members per position
    const positionCounts: Record<string, number> = {};

    // Initialize all positions with 0 count
    POSITION_HIERARCHY.forEach(position => {
      positionCounts[position] = 0;
    });

    // Count actual members per position
    members.forEach(member => {
      const { positions } = getMemberInfo(member);
      positions.forEach(position => {
        // Find matching hierarchy position
        const matchingHierarchyPos = POSITION_HIERARCHY.find(hierarchyPos =>
          position.toLowerCase().includes(hierarchyPos.toLowerCase()) ||
          hierarchyPos.toLowerCase().includes(position.toLowerCase())
        );

        if (matchingHierarchyPos) {
          positionCounts[matchingHierarchyPos] = (positionCounts[matchingHierarchyPos] || 0) + 1;
        }
      });
    });

    // Return positions with their counts in hierarchy order
    return POSITION_HIERARCHY.map(position => ({
      value: position,
      label: position,
      count: positionCounts[position]
    }));
  }, [members]);

  // Filter and sort members
  const { filteredMembers, totalPages, totalItems } = useMemo(() => {
    let filtered = members;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(member => {
        const { positions } = getMemberInfo(member);
        const searchLower = searchTerm.toLowerCase();
        return (
          member.name.toLowerCase().includes(searchLower) ||
          positions.some(position => position.toLowerCase().includes(searchLower))
        );
      });
    }

    // Apply province filter
    if (provinceFilter !== 'all') {
      filtered = filtered.filter(member => {
        const { province } = getMemberInfo(member);
        return province === provinceFilter;
      });
    }

    // Apply position filter
    if (positionFilter !== 'all') {
      filtered = filtered.filter(member => {
        const { positions } = getMemberInfo(member);
        return positions.some(position => position === positionFilter);
      });
    }

    // Sort members by name using the dropdown sort order
    const sorted = filtered.sort((a, b) => {
      const comparison = getLastName(a.name).localeCompare(getLastName(b.name));
      return nameSort === 'asc' ? comparison : -comparison;
    });

    // Calculate pagination
    const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMembers = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      filteredMembers: paginatedMembers,
      totalPages,
      totalItems: sorted.length,
    };
  }, [members, searchTerm, provinceFilter, positionFilter, nameSort, currentPage]);

  const getMemberEmails = (membersArray: FormationPersonnelMember[]): string[] =>
    membersArray.map((m) => m.email).filter((e): e is string => Boolean(e));

  const handleSelectAll = () => {
    if (selectedMembers.size === filteredMembers.length) {
      setSelectedMembers(new Set());
      onEmailSelected([]);
    } else {
      const allIds = new Set(filteredMembers.map(m => m.id));
      setSelectedMembers(allIds);
      const selectedEmails = getMemberEmails(filteredMembers);
      onEmailSelected(selectedEmails);
    }
  };

  const handleMemberSelect = (memberId: number) => {
    const newSelection = new Set(selectedMembers);
    if (newSelection.has(memberId)) {
      newSelection.delete(memberId);
    } else {
      newSelection.add(memberId);
    }
    setSelectedMembers(newSelection);

    // Update parent component with selected emails
    const selectedMemberObjects = Array.from(newSelection)
      .map(id => members.find(m => m.id === id))
      .filter(Boolean) as FormationPersonnelMember[];
    const selectedEmails = getMemberEmails(selectedMemberObjects);
    onEmailSelected(selectedEmails);
  };

  const handleEmailSelected = () => {
    const selectedMemberObjects = Array.from(selectedMembers)
      .map(id => members.find(m => m.id === id))
      .filter(Boolean) as FormationPersonnelMember[];

    const selectedEmails = getMemberEmails(selectedMemberObjects);
    openEmailClient(selectedEmails, 'Message from OSFS Formation');
  };

  // Reset page when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    switch (filterType) {
      case 'search':
        setSearchTerm(value);
        break;
      case 'province':
        setProvinceFilter(value);
        break;
      case 'position':
        setPositionFilter(value);
        break;
      case 'nameSort':
        setNameSort(value as 'asc' | 'desc');
        break;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or position..."
              value={searchTerm}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Province Filter */}
          <div>
            <label htmlFor="province-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Province
            </label>
            <select
              id="province-filter"
              value={provinceFilter}
              onChange={(e) => handleFilterChange('province', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Provinces</option>
              {availableProvinces.map((province) => (
                <option key={province.value} value={province.value}>
                  {province.label} ({province.count})
                </option>
              ))}
            </select>
          </div>

          {/* Position Filter */}
          <div>
            <label htmlFor="position-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              id="position-filter"
              value={positionFilter}
              onChange={(e) => handleFilterChange('position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Positions</option>
              {availablePositions.map((position) => (
                <option key={position.value} value={position.value}>
                  {position.label} ({position.count})
                </option>
              ))}
            </select>
          </div>

          {/* Name Sort Order */}
          <div>
            <label htmlFor="name-sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort by Name
            </label>
            <select
              id="name-sort"
              value={nameSort}
              onChange={(e) => handleFilterChange('nameSort', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>

          {/* Email Actions */}
          <div className="flex flex-col justify-end">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {selectedMembers.size === filteredMembers.length ? 'Unselect All' : 'Select All'}
              </button>
              {selectedMembers.size > 0 && (
                <button
                  onClick={handleEmailSelected}
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Email ({selectedMembers.size})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">
          {totalItems > 0 ? (
            <>
              Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> of{' '}
              <span className="font-medium">{totalItems}</span> formation personnel
            </>
          ) : (
            'No formation personnel found'
          )}
          {selectedMembers.size > 0 && (
            <span className="ml-2 text-blue-600">
              ({selectedMembers.size} selected)
            </span>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedMembers.size === filteredMembers.length && filteredMembers.length > 0}
                      ref={(el) => {
                        if (el) el.indeterminate = selectedMembers.size > 0 && selectedMembers.size < filteredMembers.length;
                      }}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Province
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => {
                  const { positions, province, email, profileImage } = getMemberInfo(member);
                  const isSelected = selectedMembers.has(member.id);

                  return (
                    <tr
                      key={member.id}
                      className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleMemberSelect(member.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {profileImage ? (
                              <Image
                                src={profileImage}
                                alt={member.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <svg className="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {formatNameLastFirst(member.name)}
                            </div>
                            {email && (
                              <div className="text-sm text-gray-500">
                                {email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{province}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {positions.map((position, idx) => (
                            <span key={idx} className="block">
                              {position}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {email && (
                            <button
                              onClick={() => openEmailClient([email], 'Message from OSFS Formation')}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="Send email"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No formation personnel found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Pagination */}
      <ConfreresPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}