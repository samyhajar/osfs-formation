'use client';

import type { FormationMember } from '@/services/formation';

interface FormationPersonnelAdditionalInfoProps {
  member: FormationMember;
}

export default function FormationPersonnelAdditionalInfo({ member }: FormationPersonnelAdditionalInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h5 className="text-sm font-medium text-gray-900 mb-2">Current Positions</h5>
        <div className="space-y-1">
          {member.positions.length > 0 ? (
            member.positions.map((position, index) => (
              <div key={index} className="mb-2">
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                  {position}
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
          {member.province ? (
            <div className="mb-2">
              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                {member.province}
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