'use client';

import { useState, useMemo } from 'react';
import type { WPMember } from '@/lib/wordpress/types';
import Image from 'next/image';
import { getMemberEmail, openEmailClient, getMemberEmails } from '@/lib/utils/email';

interface FormationPersonnelTableProps {
  members: WPMember[];
  onEmailSelected: (emails: string[]) => void;
}

type SortField = 'name' | 'province' | 'position';
type SortDirection = 'asc' | 'desc';

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

// Province order as specified
const PROVINCE_ORDER = [
  'France-West Africa Province',
  'Italian Province',
  'German Speaking Province',
  'Willmington/Philadelphia Province',
  'Toledo/Detroit Province',
  'South American And Caribbean Province',
  'Southern African Region',
  'Indian Region',
];

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
  const [sortField, setSortField] = useState<SortField>('province');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [provinceFilter, setProvinceFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Helper function to get member info
  const getMemberInfo = (member: WPMember) => {
    const positions = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'position')
      .map(term => term.name) || ['Formation Personnel'];

    const province = member._embedded?.['wp:term']
      ?.flat()
      .filter(term => term.taxonomy === 'province')
      .map(term => term.name)[0] || 'No province';

    // Normalize province name
    const normalizedProvince = provinceVariations[province] || province;

    const profileImage = member._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
    const altText = member._embedded?.['wp:featuredmedia']?.[0]?.alt_text || member.title.rendered;

    // Extract email using utility function
    const email = getMemberEmail(member);

    return {
      positions,
      province: normalizedProvince,
      profileImage,
      altText,
      email
    };
  };

  // Get unique provinces for filter
  const availableProvinces = useMemo(() => {
    const provinces = new Set<string>();
    members.forEach(member => {
      const { province } = getMemberInfo(member);
      provinces.add(province);
    });

    // Sort provinces according to specified order
    return Array.from(provinces).sort((a, b) => {
      const indexA = PROVINCE_ORDER.indexOf(a);
      const indexB = PROVINCE_ORDER.indexOf(b);

      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }, [members]);

  // Get unique formation positions for filter
  const availablePositions = useMemo(() => {
    const positions = new Set<string>();
    members.forEach(member => {
      const { positions: memberPositions } = getMemberInfo(member);
      // Only add positions that match our formation hierarchy
      memberPositions.forEach(position => {
        const isFormationPosition = POSITION_HIERARCHY.some(hierarchyPos =>
          position.toLowerCase().includes(hierarchyPos.toLowerCase()) ||
          hierarchyPos.toLowerCase().includes(position.toLowerCase())
        );
        if (isFormationPosition) {
          positions.add(position);
        }
      });
    });

    // Sort positions according to hierarchy
    return Array.from(positions).sort((a, b) => {
      const indexA = POSITION_HIERARCHY.findIndex(pos =>
        a.toLowerCase().includes(pos.toLowerCase()) ||
        pos.toLowerCase().includes(a.toLowerCase())
      );
      const indexB = POSITION_HIERARCHY.findIndex(pos =>
        b.toLowerCase().includes(pos.toLowerCase()) ||
        pos.toLowerCase().includes(b.toLowerCase())
      );

      if (indexA === -1 && indexB === -1) return a.localeCompare(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });
  }, [members]);

  // Filter and sort members
  const filteredAndSortedMembers = useMemo(() => {
    let filtered = members;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(member => {
        const { positions } = getMemberInfo(member);
        const searchLower = searchTerm.toLowerCase();
        return (
          member.title.rendered.toLowerCase().includes(searchLower) ||
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

    // Sort members
    return filtered.sort((a, b) => {
      const infoA = getMemberInfo(a);
      const infoB = getMemberInfo(b);

      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.title.rendered.localeCompare(b.title.rendered);
          break;
        case 'province':
          const provinceIndexA = PROVINCE_ORDER.indexOf(infoA.province);
          const provinceIndexB = PROVINCE_ORDER.indexOf(infoB.province);

          if (provinceIndexA === -1 && provinceIndexB === -1) {
            comparison = infoA.province.localeCompare(infoB.province);
          } else if (provinceIndexA === -1) {
            comparison = 1;
          } else if (provinceIndexB === -1) {
            comparison = -1;
          } else {
            comparison = provinceIndexA - provinceIndexB;
          }
          break;
        case 'position':
          const positionA = infoA.positions[0] || '';
          const positionB = infoB.positions[0] || '';

          const hierarchyIndexA = POSITION_HIERARCHY.findIndex(pos =>
            positionA.toLowerCase().includes(pos.toLowerCase()) ||
            pos.toLowerCase().includes(positionA.toLowerCase())
          );
          const hierarchyIndexB = POSITION_HIERARCHY.findIndex(pos =>
            positionB.toLowerCase().includes(pos.toLowerCase()) ||
            pos.toLowerCase().includes(positionB.toLowerCase())
          );

          if (hierarchyIndexA === -1 && hierarchyIndexB === -1) {
            comparison = positionA.localeCompare(positionB);
          } else if (hierarchyIndexA === -1) {
            comparison = 1;
          } else if (hierarchyIndexB === -1) {
            comparison = -1;
          } else {
            comparison = hierarchyIndexA - hierarchyIndexB;
          }
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [members, searchTerm, provinceFilter, positionFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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
      .filter(Boolean) as WPMember[];
    const selectedEmails = getMemberEmails(selectedMemberObjects);
    onEmailSelected(selectedEmails);
  };

  const handleSelectAll = () => {
    if (selectedMembers.size === filteredAndSortedMembers.length) {
      setSelectedMembers(new Set());
      onEmailSelected([]);
    } else {
      const allIds = new Set(filteredAndSortedMembers.map(m => m.id));
      setSelectedMembers(allIds);
      const selectedEmails = getMemberEmails(filteredAndSortedMembers);
      onEmailSelected(selectedEmails);
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  const handleEmailSelected = () => {
    const selectedMemberObjects = Array.from(selectedMembers)
      .map(id => members.find(m => m.id === id))
      .filter(Boolean) as WPMember[];

    const selectedEmails = getMemberEmails(selectedMemberObjects);
    openEmailClient(selectedEmails, 'Message from OSFS Formation');
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Provinces</option>
              {availableProvinces.map((province) => (
                <option key={province} value={province}>
                  {province}
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
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Positions</option>
              {availablePositions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          {/* Email Actions */}
          <div className="flex flex-col justify-end">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {selectedMembers.size === filteredAndSortedMembers.length ? 'Unselect All' : 'Select All'}
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
          Showing <span className="font-medium">{filteredAndSortedMembers.length}</span> formation personnel
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
                       checked={selectedMembers.size === filteredAndSortedMembers.length && filteredAndSortedMembers.length > 0}
                       ref={(el) => {
                         if (el) el.indeterminate = selectedMembers.size > 0 && selectedMembers.size < filteredAndSortedMembers.length;
                       }}
                       onChange={handleSelectAll}
                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                     />
                   </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Name</span>
                      {getSortIcon('name')}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('province')}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Province</span>
                      {getSortIcon('province')}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('position')}
                      className="flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>Position</span>
                      {getSortIcon('position')}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedMembers.map((member) => {
                  const { positions, province, profileImage, altText, email } = getMemberInfo(member);
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
                                alt={altText}
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
                              {member.title.rendered}
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
                          {positions.map((position, index) => (
                            <span key={index} className="block">
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

      {filteredAndSortedMembers.length === 0 && (
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
    </div>
  );
}