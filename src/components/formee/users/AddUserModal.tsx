'use client';

import Modal from '@/components/ui/Modal';
import AddUserForm from './AddUserForm';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'formator' | 'formee';
  onUserAdded: () => void; // Callback for successful addition
}

export default function AddUserModal({ isOpen, onClose, role, onUserAdded }: AddUserModalProps) {

  const handleSuccess = () => {
    onUserAdded(); // Notify parent about the addition
    onClose();     // Close the modal
  };

  const modalTitle = `Add New ${role.charAt(0).toUpperCase() + role.slice(1)}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <AddUserForm
        role={role}
        onSuccess={handleSuccess}
        onCancel={onClose} // Use onClose directly for cancel
       />
    </Modal>
  );
}