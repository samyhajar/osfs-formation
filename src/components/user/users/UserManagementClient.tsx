'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import FormatorUserTable from './FormatorUserTable';
import FormeeUserTable from './FormeeUserTable';
import AddUserModal from './AddUserModal';
import { Button } from '@/components/ui/Button';
import { Database } from '@/types/supabase';
import PaginationControls from '@/components/shared/PaginationControls';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserManagementClientProps {
  initialFormatorUsers: Profile[];
  initialFormeeUsers: Profile[];
  formatorCount: number;
  formeeCount: number;
  currentPageFormator: number;
  currentPageFormee: number;
  limit: number;
}

export default function UserManagementClient({
  initialFormatorUsers,
  initialFormeeUsers,
  formatorCount,
  formeeCount,
  currentPageFormator,
  currentPageFormee,
  limit,
}: UserManagementClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToAdd, setRoleToAdd] = useState<'formator' | 'formee'>('formee');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const formatorUsers = initialFormatorUsers;
  const formeeUsers = initialFormeeUsers;

  const totalFormatorPages = Math.ceil(formatorCount / limit);
  const totalFormeePages = Math.ceil(formeeCount / limit);

  const openModal = (role: 'formator' | 'formee') => {
    setRoleToAdd(role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUserAdded = () => {
    router.refresh();
    console.log(`Successfully added ${roleToAdd}`);
  };

  const handlePageChange = (role: 'formator' | 'formee', newPage: number) => {
    const currentParams = new URLSearchParams(searchParams?.toString() ?? '');
    if (role === 'formator') {
      currentParams.set('formatorPage', String(newPage));
    } else {
      currentParams.set('formeePage', String(newPage));
    }
    if (role === 'formator' && !currentParams.has('formeePage')) {
      currentParams.set('formeePage', String(currentPageFormee));
    } else if (role === 'formee' && !currentParams.has('formatorPage')) {
      currentParams.set('formatorPage', String(currentPageFormator));
    }
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage formator and formee user accounts.</p>
      </div>

      {/* Formator Users Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Formators ({formatorCount})</h2>
          <Button onClick={() => openModal('formator')} variant="primary">
            + Add Formator
          </Button>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
         <FormatorUserTable users={formatorUsers} />
         {totalFormatorPages > 1 && (
            <PaginationControls
              currentPage={currentPageFormator}
              totalPages={totalFormatorPages}
              onPageChange={(newPage: number) => handlePageChange('formator', newPage)}
            />
         )}
        </div>
      </div>

      {/* Formee Users Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Formees ({formeeCount})</h2>
          <Button onClick={() => openModal('formee')} variant="primary">
            + Add Formee
          </Button>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <FormeeUserTable users={formeeUsers} />
          {totalFormeePages > 1 && (
            <PaginationControls
                currentPage={currentPageFormee}
                totalPages={totalFormeePages}
                onPageChange={(newPage: number) => handlePageChange('formee', newPage)}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <AddUserModal
          isOpen={isModalOpen}
          onClose={closeModal}
          role={roleToAdd}
          onUserAdded={handleUserAdded}
        />
      )}
    </div>
  );
}