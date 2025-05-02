'use client';

import Modal from '@/components/ui/Modal';
import AddUserForm from './AddUserForm';
import { useTranslations } from 'next-intl';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'formator' | 'formee';
  onUserAdded: () => void; // Callback for successful addition
}

export default function AddUserModal({ isOpen, onClose, role, onUserAdded }: AddUserModalProps) {
  const t = useTranslations('AdminUsersPage');

  const handleSuccess = () => {
    onUserAdded(); // Notify parent about the addition
    onClose();     // Close the modal
  };

  const translatedRole = role === 'formator' ? t('roleFormator') : t('roleFormee');
  const modalTitle = `${t('addUserModalTitlePrefix')} ${translatedRole}`;

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