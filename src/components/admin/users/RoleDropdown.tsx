'use client';

import { useState } from 'react';
import { Database } from '@/types/supabase';
import { createClient } from '@/lib/supabase/browser-client';

type UserRole = Database['public']['Tables']['profiles']['Row']['role'];

interface RoleDropdownProps {
  userId: string;
  currentRole: UserRole;
  onRoleChange?: (newRole: UserRole) => void;
  disabled?: boolean;
}

const ROLE_OPTIONS: { value: NonNullable<UserRole>; label: string; color: string }[] = [
  { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-800' },
  { value: 'editor', label: 'Editor', color: 'bg-green-100 text-green-800' },
  { value: 'user', label: 'User', color: 'bg-blue-100 text-blue-800' },
];

export default function RoleDropdown({
  userId,
  currentRole,
  onRoleChange,
  disabled = false
}: RoleDropdownProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle null role case
  const safeCurrentRole = currentRole || 'user';

  const handleRoleChange = async (newRole: NonNullable<UserRole>) => {
    if (newRole === currentRole || isUpdating) return;

    setIsUpdating(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      // Call the callback if provided
      onRoleChange?.(newRole);

      // Refresh the page to update the UI
      window.location.reload();

    } catch (err) {
      console.error('Error updating user role:', err);
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentRoleStyle = () => {
    const roleOption = ROLE_OPTIONS.find(option => option.value === safeCurrentRole);
    return roleOption?.color || 'bg-gray-100 text-gray-800';
  };

  if (disabled) {
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getCurrentRoleStyle()}`}>
        {safeCurrentRole}
      </span>
    );
  }

  return (
    <div className="relative">
      <select
        value={safeCurrentRole}
        onChange={(e) => void handleRoleChange(e.target.value as NonNullable<UserRole>)}
        disabled={isUpdating}
        className={`
          px-2 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          ${getCurrentRoleStyle()}
          ${isUpdating ? 'animate-pulse' : ''}
        `}
        title={isUpdating ? 'Updating...' : 'Click to change role'}
      >
        {ROLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 text-red-700 text-xs rounded shadow-lg z-10 whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}