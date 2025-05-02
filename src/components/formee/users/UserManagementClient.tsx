'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormatorUserTable from '@/components/dashboard/admin/users/FormatorUserTable';
import FormeeUserTable from '@/components/dashboard/admin/users/FormeeUserTable';
import AddUserModal from './AddUserModal';
import { Button } from '@/components/ui/Button';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserManagementClientProps {
  initialFormatorUsers: Profile[];
  initialFormeeUsers: Profile[];
}

export default function UserManagementClient({
  initialFormatorUsers,
  initialFormeeUsers,
}: UserManagementClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToAdd, setRoleToAdd] = useState<'formator' | 'formee'>('formee');
  const router = useRouter();

  const formatorUsers = initialFormatorUsers;
  const formeeUsers = initialFormeeUsers;

  const openModal = (role: 'formator' | 'formee') => {
    setRoleToAdd(role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUserAdded = () => {
    router.refresh();
    // Consider adding a toast notification here for better UX
    console.log(`Successfully added ${roleToAdd}`);
  };

  return (
    <div className="space-y-8"> {/* Increased spacing */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1> {/* Adjusted heading style */}
        <p className="text-sm text-gray-600 mt-1">Manage formator and formee user accounts.</p> {/* Adjusted text style */}
      </div>

      {/* Formator Users Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden"> {/* Subtle shadow */}
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200"> {/* Added padding and border */}
          <h2 className="text-lg font-medium text-gray-900">Formators ({formatorUsers.length})</h2> {/* Adjusted heading style */}
          <Button onClick={() => openModal('formator')} variant="primary">
            + Add Formator
          </Button>
        </div>
        <div className="p-4 sm:p-6"> {/* Padding for the table */}
         <FormatorUserTable users={formatorUsers} />
        </div>
      </div>

      {/* Formee Users Section */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden"> {/* Subtle shadow */}
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200"> {/* Added padding and border */}
          <h2 className="text-lg font-medium text-gray-900">Formees ({formeeUsers.length})</h2> {/* Adjusted heading style */}
          <Button onClick={() => openModal('formee')} variant="primary">
            + Add Formee
          </Button>
        </div>
        <div className="p-4 sm:p-6"> {/* Padding for the table */}
          <FormeeUserTable users={formeeUsers} />
        </div>
      </div>

      {/* Modal - Rendered conditionally based on state */}
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