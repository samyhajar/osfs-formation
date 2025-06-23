'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ConfreresFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  provinceFilter: string;
  setProvinceFilter: (province: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: string) => void;
  uniqueStatuses: string[];
  uniqueProvinces: string[];
}

export default function ConfreresFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  provinceFilter,
  setProvinceFilter,
  sortOrder,
  setSortOrder,
  uniqueStatuses,
  uniqueProvinces,
}: ConfreresFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-accent-primary focus:border-accent-primary"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
          >
            <option value="">All Statuses</option>
            {uniqueStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
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
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
          >
            <option value="">All Provinces</option>
            {uniqueProvinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label htmlFor="sort-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Sort by Name
          </label>
          <select
            id="sort-filter"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
}