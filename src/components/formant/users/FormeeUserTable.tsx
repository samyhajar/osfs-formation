import React from 'react';
import { Database } from '@/types/supabase';
import { UserAvatar } from '@/components/ui/UserAvatar';

// Define the type for a user profile row more explicitly
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface FormeeUserTableProps {
  users: ProfileRow[];
}

// Helper to format date (could be moved to a shared utils file)
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString));
};

export default function FormeeUserTable({ users }: FormeeUserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
              Created At
            </th>
            <th scope="col" className="relative px-6 py-3 align-middle">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500 italic">
                No formees found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap align-middle">
                  <UserAvatar user={user} size="md" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap align-middle">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap align-middle">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right align-middle">
                  <button className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400 disabled:cursor-not-allowed" disabled title="Actions coming soon">
                    ...
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}