import { Database } from '@/types/supabase';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { useTranslations } from 'next-intl';
import RoleDropdown from './RoleDropdown';

// Define the type for a user profile row more explicitly
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface AllUsersTableProps {
  users: ProfileRow[];
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

export default function AllUsersTable({ users }: AllUsersTableProps) {
  const t = useTranslations('AdminUsersTable');

  return (
    <div className="overflow-x-auto">
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
                  <div className="text-sm text-gray-400">
                    Role management
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