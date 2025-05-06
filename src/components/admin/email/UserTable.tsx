'use client';

import { useTranslations } from 'next-intl';
import { User } from './types';
import { PaginationControls } from '@/components/admin/PaginationControls';
import { UserRow } from './UserRow';

type UserTableProps = {
  loading: boolean;
  paginatedUsers: User[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedUserIds: string[];
  toggleUserSelection: (id: string) => void;
};

export const UserTable = ({
  loading,
  paginatedUsers,
  totalPages,
  currentPage,
  setCurrentPage,
  selectedUserIds,
  toggleUserSelection,
}: UserTableProps) => {
  const t = useTranslations('EmailPage');

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-white sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                {/* Checkbox column */}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('headerName')}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('headerEmail')}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('headerStatus')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              // Loading skeletons
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-4 w-4 bg-gray-200 rounded mx-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                  </td>
                </tr>
              ))
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  selected={selectedUserIds.includes(user.id)}
                  toggleUserSelection={toggleUserSelection}
                  t={t}
                />
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  {t('noUsersFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </>
  );
};