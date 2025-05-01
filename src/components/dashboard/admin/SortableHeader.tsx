'use client';

import React from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Re-define sort types or import from a shared location
type SortKey = 'title' | 'file_type' | 'category' | 'created_at' | null;
type SortDirection = 'asc' | 'desc' | null;

// Props for the component
interface SortableHeaderProps {
  label: string;
  sortKey: SortKey;
  sortDirection: SortDirection;
  columnKey: NonNullable<SortKey>; // The key this header represents
  onSort: (key: SortKey) => void;
}

export const SortableHeader = ({
  label,
  sortKey: currentSortKey,
  sortDirection,
  columnKey,
  onSort,
}: SortableHeaderProps) => {
  const isActive = currentSortKey === columnKey;
  const SortIcon = sortDirection === 'asc' ? ArrowUpIcon : ArrowDownIcon;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onSort(columnKey);
    }
  };

  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSort(columnKey)}
        onKeyPress={handleKeyPress}
        className="inline-flex items-center gap-1 group cursor-pointer focus:outline-none rounded"
      >
        <span className="group-hover:text-gray-900 transition-colors duration-150">{label}</span>

        {/* Sort Direction Icon Container */}
        <span className="inline-flex w-3 h-3">
          {isActive && <SortIcon className="h-3 w-3 text-gray-600 group-hover:text-gray-900" />}
        </span>

        {/* Clear Sort Button Container */}
        <span className="inline-flex w-4 h-4">
          {isActive && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSort(null);
              }}
              className="p-0.5 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none"
              aria-label={`Remove sort by ${label}`}
            >
              <XMarkIcon className="h-3 w-3" />
            </button>
          )}
        </span>
      </div>
    </th>
  );
};