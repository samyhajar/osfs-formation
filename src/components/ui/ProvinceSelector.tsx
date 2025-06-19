'use client';

import { useState } from 'react';
import type { WPMember, WPTerm } from '@/lib/wordpress/types';

interface ProvinceSelectorProps {
  provinces: WPTerm[];
  membersByProvince: Record<number, WPMember[]>;
  selectedMemberIds: number[];
  onMemberSelectionChange: (memberIds: number[]) => void;
}

function getTermName(member: WPMember, taxonomySlug: 'province' | 'state' | 'ministry' | 'position'): string | null {
  if (!member._embedded?.['wp:term']) return null;

  // Find the taxonomy group for the specified slug
  const taxonomyGroup = member._embedded['wp:term'].find((termGroup) =>
    termGroup.some((term) => term.taxonomy === taxonomySlug)
  );

  if (!taxonomyGroup) return null;

  // Find the first term matching the taxonomy
  const term = taxonomyGroup.find((t) => t.taxonomy === taxonomySlug);
  return term ? term.name : null;
}

export default function ProvinceSelector({
  provinces,
  membersByProvince,
  selectedMemberIds,
  onMemberSelectionChange,
}: ProvinceSelectorProps) {
  const [expandedProvinces, setExpandedProvinces] = useState<Set<number>>(new Set());

  const toggleProvinceExpansion = (provinceId: number) => {
    setExpandedProvinces(prev => {
      const newSet = new Set(prev);
      if (newSet.has(provinceId)) {
        newSet.delete(provinceId);
      } else {
        newSet.add(provinceId);
      }
      return newSet;
    });
  };

  const handleMemberToggle = (memberId: number) => {
    const newSelection = selectedMemberIds.includes(memberId)
      ? selectedMemberIds.filter(id => id !== memberId)
      : [...selectedMemberIds, memberId];
    onMemberSelectionChange(newSelection);
  };

  const handleProvinceToggle = (provinceId: number) => {
    const provinceMembers = membersByProvince[provinceId] || [];
    const provinceMemberIds = provinceMembers.map(member => member.id);

    const allSelected = provinceMemberIds.every(id => selectedMemberIds.includes(id));

    let newSelection: number[];
    if (allSelected) {
      // Deselect all members from this province
      newSelection = selectedMemberIds.filter(id => !provinceMemberIds.includes(id));
    } else {
      // Select all members from this province
      const newIds = provinceMemberIds.filter(id => !selectedMemberIds.includes(id));
      newSelection = [...selectedMemberIds, ...newIds];
    }

    onMemberSelectionChange(newSelection);
  };

  const getProvinceSelectionState = (provinceId: number) => {
    const provinceMembers = membersByProvince[provinceId] || [];
    const provinceMemberIds = provinceMembers.map(member => member.id);

    if (provinceMemberIds.length === 0) return 'none';

    const selectedCount = provinceMemberIds.filter(id => selectedMemberIds.includes(id)).length;

    if (selectedCount === 0) return 'none';
    if (selectedCount === provinceMemberIds.length) return 'all';
    return 'partial';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select Formation Personnel by Province</h3>

      <div className="space-y-2">
        {provinces.map(province => {
          const members = membersByProvince[province.id] || [];
          const isExpanded = expandedProvinces.has(province.id);
          const selectionState = getProvinceSelectionState(province.id);

          return (
            <div key={province.id} className="border rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`province-${province.id}`}
                    checked={selectionState === 'all'}
                    ref={input => {
                      if (input) input.indeterminate = selectionState === 'partial';
                    }}
                    onChange={() => handleProvinceToggle(province.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`province-${province.id}`}
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    {province.name} ({members.length} members)
                  </label>
                </div>

                <button
                  onClick={() => toggleProvinceExpansion(province.id)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  <svg
                    className={`h-4 w-4 transform transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {isExpanded && members.length > 0 && (
                <div className="mt-3 pl-6 space-y-2 border-l-2 border-gray-200">
                  {members.map(member => {
                    const positionName = getTermName(member, 'position');
                    const isSelected = selectedMemberIds.includes(member.id);

                    return (
                      <div key={member.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`member-${member.id}`}
                          checked={isSelected}
                          onChange={() => handleMemberToggle(member.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`member-${member.id}`}
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {member.title.rendered}
                          {positionName && (
                            <span className="text-gray-500 ml-2">({positionName})</span>
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}

              {isExpanded && members.length === 0 && (
                <div className="mt-3 pl-6 text-sm text-gray-500">
                  No members found in this province.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <strong>{selectedMemberIds.length}</strong> member{selectedMemberIds.length !== 1 ? 's' : ''} selected
      </div>
    </div>
  );
}