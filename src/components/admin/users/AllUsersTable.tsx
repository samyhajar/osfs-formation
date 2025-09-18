import { Database } from '@/types/supabase';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useTranslations } from 'next-intl';
import RoleDropdown from './RoleDropdown';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

// Define the type for a user profile row more explicitly
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface AllUsersTableProps {
  users: ProfileRow[];
  onUserDeleted?: (userId: string) => void;
}

// Helper to format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString));
};

export default function AllUsersTable({ users, onUserDeleted }: AllUsersTableProps) {
  const t = useTranslations('AdminUsersTable');
  const { profile } = useAuth();
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Only show delete functionality for admin users
  const isAdmin = profile?.role === 'admin';

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingUserId(userId);
      setError(null);

      const response = await fetch('/api/delete-pending-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete user');
      }

      // Call the callback to update the parent component
      if (onUserDeleted) {
        onUserDeleted(userId);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
              {t('headerName')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
              {t('headerRole')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
              {t('headerCreatedAt')}
            </th>
            <th scope="col" className="relative px-6 py-3 align-middle">
              <span className="sr-only">{t('headerActions')}</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 italic">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap align-middle">
                  <UserAvatar user={user} size="md" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap align-middle">
                  <RoleDropdown
                    userId={user.id}
                    currentRole={user.role}
                    onRoleChange={(newRole) => {
                      console.log(`Role changed for user ${user.id} to ${newRole}`);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap align-middle">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap align-middle text-sm text-gray-900">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right align-middle">
                  <div className="flex items-center justify-end gap-2">
                    {isAdmin && (
                      <button
                        onClick={() => void handleDeleteUser(user.id, user.name || user.email || 'Unknown User')}
                        disabled={deletingUserId === user.id}
                        className={`p-2 rounded-md transition-colors ${
                          deletingUserId === user.id
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                        }`}
                        title="Delete user"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                    {!isAdmin && (
                      <div className="text-sm text-gray-400">
                        Role management
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}