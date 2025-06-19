'use client';

import Modal from '@/components/ui/Modal';
import AddUserForm from './AddUserForm';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: 'admin' | 'editor' | 'user';
  onUserAdded: () => void; // Callback for successful addition
}

export default function AddUserModal({
  isOpen,
  onClose,
  defaultRole = 'user',
  onUserAdded
}: AddUserModalProps) {
  const handleSuccess = () => {
    onUserAdded(); // Notify parent about the addition
    onClose();     // Close the modal
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
      <AddUserForm
        defaultRole={defaultRole}
        onSuccess={handleSuccess}
        onCancel={onClose} // Use onClose directly for cancel
       />
    </Modal>
  );
}