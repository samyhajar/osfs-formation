'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import AllUsersTable from './AllUsersTable';
import { Database } from '@/types/supabase';
import PaginationControls from '@/components/shared/PaginationControls';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserManagementClientProps {
  initialUsers: Profile[];
  totalCount: number;
  currentPage: number;
  limit: number;
}

export default function UserManagementClient({
  initialUsers,
  totalCount,
  currentPage,
  limit,
}: UserManagementClientProps) {
  const t = useTranslations('AdminUsersPage');
  const [users, setUsers] = useState(initialUsers);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(searchParams?.toString() ?? '');
    currentParams.set('page', String(newPage));
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const handleUserDeleted = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{t('pageTitle')}</h1>
        <p className="text-sm text-gray-600 mt-1">{t('pageDescription')}</p>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Users</h2>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <AllUsersTable users={users} onUserDeleted={handleUserDeleted} />
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}