'use client';

import { useState, useMemo } from 'react';
import type { WPMember } from '@/lib/wordpress/types';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/outline';
import { getMemberEmail, openEmailClient, getMemberEmails } from '@/lib/utils/email';
import ConfrereDetailModal from './ConfrereDetailModal';
import ConfreresFilters from './ConfreresFilters';
import ConfreresPagination from './ConfreresPagination';

interface ConfreresTableProps {
  members: WPMember[];
}

const ITEMS_PER_PAGE = 20;

export default function ConfreresTable({ members }: ConfreresTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<WPMember | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set());

  // Canonical order and normalization maps for provinces
  const provinceOrder = [
    'France-West Africa Province',
    'Italian Province',
    'German Speaking Province',
    'Willmington/Philadelphia Province',
    'Toledo/Detroit Province',
    'South American And Caribbean Province',
    'Southern African Region',
    'Indian Region',
  ];

  const provinceVariations: Record<string, string> = {
    // German
    'Austrian/South-German Province': 'German Speaking Province',
    'South-German Province': 'German Speaking Province',
    'Austrian Province': 'German Speaking Province',
    'German Province': 'German Speaking Province',
    'German-speaking Province': 'German Speaking Province',

    // Willmington / Philadelphia spelling variants
    'Philadelphia Province': 'Willmington/Philadelphia Province',
    'Wilmington Province': 'Willmington/Philadelphia Province',
    'Willmington Province': 'Willmington/Philadelphia Province',
    'Wilmington/Philadelphia Province': 'Willmington/Philadelphia Province',

    // Toledo / Detroit
    'Detroit Province': 'Toledo/Detroit Province',
    'Toledo Province': 'Toledo/Detroit Province',

    // South American and Caribbean
    'South American Province': 'South American And Caribbean Province',
    'South America Province': 'South American And Caribbean Province',
    'Caribbean Province': 'South American And Caribbean Province',
    'Caribbean Region': 'South American And Caribbean Province',
    'South American and Caribbean Province': 'South American And Caribbean Province',

    // France-West Africa common typo
    'France West Africa Province': 'France-West Africa Province',
  };

  // Helper function to get term name by ID from embedded data
  const getTermName = (
    member: WPMember,
    taxonomyType: string,
    termIds: number[] | undefined,
  ): string => {
    if (!member._embedded?.['wp:term'] || !termIds || termIds.length === 0)
      return 'Unknown';

    const terms = member._embedded['wp:term'].flat();
    const matchingTerm = terms.find(term =>
      termIds.includes(term.id) && term.taxonomy === taxonomyType
    );

    return matchingTerm?.name || 'Unknown';
  };

  // Helper function to get featured image URL
  const getFeaturedImageUrl = (member: WPMember): string | null => {
    if (!member._embedded?.['wp:featuredmedia']?.[0]) return null;
    return member._embedded['wp:featuredmedia'][0].source_url || null;
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

  // Note: getMemberEmail is now imported from utils

  // Get unique values for filters
   
  const { uniqueStatuses, orderedProvinces } = useMemo(() => {
    // Define the exact formation statuses in the specified order
    const formationStatuses = [
      'Postulant',
      'Novice',
      'Bro.Novice',
      'Scholastic',
      'Deacon',
    ];

    // Count members for each formation status
    const statusCounts: Record<string, number> = {};

    // Initialize all formation statuses with 0 count
    formationStatuses.forEach(status => {
      statusCounts[status] = 0;
    });

    // Count actual members for each status
    members.forEach(member => {
      const memberStatus = getTermName(member, 'state', member.state);

      // Check for exact matches and variations
      if (memberStatus === 'Postulant') {
        statusCounts['Postulant']++;
      } else if (memberStatus === 'Novice') {
        statusCounts['Novice']++;
      } else if (memberStatus === 'Bro.Novice' || memberStatus === 'Bro. Novice') {
        statusCounts['Bro.Novice']++;
      } else if (memberStatus === 'Scholastic') {
        statusCounts['Scholastic']++;
      } else if (memberStatus === 'Deacon') {
        statusCounts['Deacon']++;
      }
    });

    // Create status options with counts in the specified order
    const statusesWithCounts = formationStatuses.map(status => ({
      value: status,
      label: `${status} (${statusCounts[status]})`,
      count: statusCounts[status]
    }));

    console.log('📊 Formation Status Counts:', statusCounts);

    const memberProvinces = new Set<string>();
    members.forEach(member => {
      const province = getTermName(member, 'province', member.province);
      if (province !== 'Unknown') memberProvinces.add(province);
    });

    // Normalize province names and collect existing ones
    const normalizedProvinces = new Set<string>();
    memberProvinces.forEach(province => {
      const normalizedName = provinceVariations[province] || province;
      normalizedProvinces.add(normalizedName);
    });

    // Filter to only show provinces that exist in the data and maintain the specified order
    const filteredProvinces = provinceOrder.filter(province =>
      normalizedProvinces.has(province)
    );

    // Add any provinces that exist in data but aren't in our main list (for debugging)
    memberProvinces.forEach(province => {
      const normalizedName = provinceVariations[province] || province;
      if (!provinceOrder.includes(normalizedName) && !filteredProvinces.includes(province)) {
        console.log(`📍 Found unmapped province: "${province}" -> normalized: "${normalizedName}"`);
        filteredProvinces.push(province); // Add at the end for now
      }
    });

    return {
      uniqueStatuses: statusesWithCounts,
      orderedProvinces: filteredProvinces,
    };
  }, [members]);

  // Filter, sort and paginate members
   
  const { filteredMembers, totalPages, totalItems } = useMemo(() => {
    // Define the exact formation statuses we want to show
    const allowedFormationStatuses = [
      'Postulant',
      'Novice',
      'Bro.Novice',
      'Bro. Novice', // Include space variation
      'Scholastic',
      'Deacon',
    ];

    const filtered = members.filter(member => {
      // First check if member has one of our allowed formation statuses
      const memberStatus = getTermName(member, 'state', member.state);
      const hasFormationStatus = allowedFormationStatuses.includes(memberStatus);

      // If member doesn't have a formation status, exclude them
      if (!hasFormationStatus) {
        return false;
      }

      // Apply other filters
      const matchesSearch = member.title.rendered.toLowerCase().includes(searchTerm.toLowerCase());

      // For status filtering, normalize "Bro. Novice" to "Bro.Novice" for comparison
      let matchesStatus = true;
      if (statusFilter) {
        const normalizedMemberStatus = memberStatus === 'Bro. Novice' ? 'Bro.Novice' : memberStatus;
        matchesStatus = normalizedMemberStatus === statusFilter;
      }

      // Handle province filtering with normalization
      let matchesProvince = true;
      if (provinceFilter) {
        const memberProvince = getTermName(member, 'province', member.province);
        const normalizedMemberProvince = provinceVariations[memberProvince] || memberProvince;
        matchesProvince = normalizedMemberProvince === provinceFilter || memberProvince === provinceFilter;
      }

      return matchesSearch && matchesStatus && matchesProvince;
    });

    // Sort alphabetically by name
    const sorted = [...filtered].sort((a, b) => {
      const comparison = getLastName(a.title.rendered).localeCompare(getLastName(b.title.rendered), 'en', { sensitivity: 'base' });
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMembers = sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      filteredMembers: paginatedMembers,
      totalPages,
      totalItems: sorted.length,
    };
  }, [members, searchTerm, statusFilter, provinceFilter, sortOrder, currentPage]);

  // Reset page when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    switch (filterType) {
      case 'search':
        setSearchTerm(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      case 'province':
        setProvinceFilter(value);
        break;
      case 'sort':
        setSortOrder(value as 'asc' | 'desc');
        break;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Email selection handlers
  const handleMemberSelect = (memberId: number) => {
    const newSelection = new Set(selectedMembers);
    if (newSelection.has(memberId)) {
      newSelection.delete(memberId);
    } else {
      newSelection.add(memberId);
    }
    setSelectedMembers(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedMembers.size === filteredMembers.length) {
      setSelectedMembers(new Set());
    } else {
      const allIds = new Set(filteredMembers.map(m => m.id));
      setSelectedMembers(allIds);
    }
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
      <ConfreresFilters
        searchTerm={searchTerm}
        setSearchTerm={(value) => handleFilterChange('search', value)}
        statusFilter={statusFilter}
        setStatusFilter={(value) => handleFilterChange('status', value)}
        provinceFilter={provinceFilter}
        setProvinceFilter={(value) => handleFilterChange('province', value)}
        sortOrder={sortOrder}
        setSortOrder={(value) => handleFilterChange('sort', value)}
        uniqueStatuses={uniqueStatuses}
        uniqueProvinces={orderedProvinces}
      />

      {/* Email Selection Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow">
        <button
          onClick={handleEmailSelected}
          disabled={selectedMembers.size === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          E-mail to selected ({selectedMembers.size})
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {selectedMembers.size === filteredMembers.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-gray-500">
            {totalItems} members found
          </span>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredMembers.map((member) => {
            const imageUrl = getFeaturedImageUrl(member);
            const status = getTermName(member, 'state', member.state);
            const province = getTermName(member, 'province', member.province);
            const isSelected = selectedMembers.has(member.id);

            return (
              <li key={member.id}>
                <div className={`px-4 py-4 flex items-center justify-between hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex-shrink-0 mr-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleMemberSelect(member.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={member.title.rendered}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {formatNameLastFirst(member.title.rendered)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {status} • {province}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                    <button
                      onClick={() => openEmailClient([getMemberEmail(member)], 'Message from OSFS Formation')}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      title="Send email"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      <ConfreresPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />

      {/* Detail Modal */}
      {selectedMember && (
        <ConfrereDetailModal
          member={selectedMember}
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}