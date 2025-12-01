'use client';

import Modal from '@/components/ui/Modal';

interface PendingUserRejectModalProps {
  isOpen: boolean;
  userName: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function PendingUserRejectModal({
  isOpen,
  userName,
  onCancel,
  onConfirm,
}: PendingUserRejectModalProps) {
  const displayName = userName || 'this user';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Reject user application"
      size="sm"
    >
      <p className="text-sm text-slate-700">
        Are you sure you want to reject{' '}
        <span className="font-semibold">{displayName}</span>? This action cannot
        be undone.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 sm:w-auto"
        >
          Confirm rejection
        </button>
      </div>
    </Modal>
  );
}
