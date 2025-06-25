'use client';

import type { FormationPersonnelMember } from '@/types/formation-personnel';

interface FormationPersonnelAdditionalInfoProps {
  member: FormationPersonnelMember;
}

export default function FormationPersonnelAdditionalInfo({ member }: FormationPersonnelAdditionalInfoProps) {
  // Use the simplified shape: activeTargetPositions already contains only current roles
  const currentPositions = member.activeTargetPositions;

  // Assume province is defined on the first active position (API guarantees at least one active position)
  const province = currentPositions[0]?.province ?? null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h5 className="text-sm font-medium text-gray-900 mb-2">Current Positions</h5>
        <div className="space-y-1">
          {currentPositions.length > 0 ? (
            currentPositions.map((pos, index: number) => (
              <div key={index} className="mb-2">
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                  {pos.position}
                </span>
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500">No current positions</span>
          )}
        </div>
      </div>

      <div>
        <h5 className="text-sm font-medium text-gray-900 mb-2">Province</h5>
        <div className="space-y-1">
          {province ? (
            <div className="mb-2">
              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                {province}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500">No province assigned</span>
          )}
        </div>
      </div>
    </div>
  );
}