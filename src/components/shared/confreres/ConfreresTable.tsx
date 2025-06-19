'use client';

import { useState, useMemo } from 'react';
import type { WPMember } from '@/lib/wordpress/types';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/24/outline';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<WPMember | null>(null);

  // Helper function to get term name by ID from embedded data
  const getTermName = (member: WPMember, taxonomyType: string, termIds: number[]): string => {
    if (!member._embedded?.['wp:term'] || termIds.length === 0) return 'Unknown';

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

  // Get unique values for filters
  const { uniqueStatuses, uniqueProvinces } = useMemo(() => {
    const statuses = new Set<string>();
    const provinces = new Set<string>();

    members.forEach(member => {
      const status = getTermName(member, 'state', member.state);
      const province = getTermName(member, 'province', member.province);

      if (status !== 'Unknown') statuses.add(status);
      if (province !== 'Unknown') provinces.add(province);
    });

    return {
      uniqueStatuses: Array.from(statuses).sort(),
      uniqueProvinces: Array.from(provinces).sort(),
    };
  }, [members]);

  // Filter and paginate members
  const { filteredMembers, totalPages, totalItems } = useMemo(() => {
    const filtered = members.filter(member => {
      const matchesSearch = member.title.rendered.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || getTermName(member, 'state', member.state) === statusFilter;
      const matchesProvince = !provinceFilter || getTermName(member, 'province', member.province) === provinceFilter;

      return matchesSearch && matchesStatus && matchesProvince;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMembers = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      filteredMembers: paginatedMembers,
      totalPages,
      totalItems: filtered.length,
    };
  }, [members, searchTerm, statusFilter, provinceFilter, currentPage]);

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
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        uniqueStatuses={uniqueStatuses}
        uniqueProvinces={uniqueProvinces}
      />

      {/* Results Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredMembers.map((member) => {
            const imageUrl = getFeaturedImageUrl(member);
            const status = getTermName(member, 'state', member.state);
            const province = getTermName(member, 'province', member.province);

            return (
              <li key={member.id}>
                <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center min-w-0 flex-1">
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
                            {member.title.rendered}
                          </p>
                          <p className="text-sm text-gray-500">
                            {status} • {province}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
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