'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, CheckIcon } from 'lucide-react';
import { User } from './types';
import { UserTable } from './UserTable';

// Number of items to display per page
const ITEMS_PER_PAGE = 5;

type UsersTableProps = {
  users: User[];
  selectedUserIds: string[];
  toggleUserSelection: (id: string) => void;
  documentsConfirmed: boolean;
  loading: boolean;
  sendingEmails: boolean;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  successMessage: string;
  errorMessage: string;
  handleSendEmails: (e: React.MouseEvent) => void;
};

export const UsersTable = ({
  users,
  selectedUserIds,
  toggleUserSelection,
  documentsConfirmed,
  loading,
  sendingEmails,
  statusFilter,
  setStatusFilter,
  successMessage,
  errorMessage,
  handleSendEmails,
}: UsersTableProps) => {
  const t = useTranslations('EmailPage');
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [searchUsers, setSearchUsers] = useState('');

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase() || '').includes(searchUsers.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchUsers.toLowerCase())
  );

  // Pagination calculations for users
  const totalUserPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const userStartIndex = (currentUserPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(userStartIndex, userStartIndex + ITEMS_PER_PAGE);

  if (!documentsConfirmed) {
    return null;
  }

  return (
    <div className="w-7/12">
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{t('selectUsers')}</h3>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  className="py-1.5 pl-8 pr-3 text-sm rounded-lg border border-gray-200 bg-white text-gray-700 w-48"
                  placeholder={t('searchUsers')}
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              </div>
              <select
                className="py-1.5 px-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-700"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">{t('allStatuses')}</option>
                <option value="pending">{t('statusPending')}</option>
                <option value="active">{t('statusActive')}</option>
                <option value="inactive">{t('statusInactive')}</option>
              </select>
            </div>
          </div>
        </div>

        <UserTable
          loading={loading}
          paginatedUsers={paginatedUsers}
          totalPages={totalUserPages}
          currentPage={currentUserPage}
          setCurrentPage={setCurrentUserPage}
          selectedUserIds={selectedUserIds}
          toggleUserSelection={toggleUserSelection}
        />

        {/* Send Email Action */}
        <SendEmailButton
          selectedUserIds={selectedUserIds}
          sendingEmails={sendingEmails}
          successMessage={successMessage}
          errorMessage={errorMessage}
          handleSendEmails={handleSendEmails}
          t={t}
        />
      </div>
    </div>
  );
};

type SendEmailButtonProps = {
  selectedUserIds: string[];
  sendingEmails: boolean;
  successMessage: string;
  errorMessage: string;
  handleSendEmails: (e: React.MouseEvent) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
};

const SendEmailButton = ({
  selectedUserIds,
  sendingEmails,
  successMessage,
  errorMessage,
  handleSendEmails,
  t
}: SendEmailButtonProps) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white mt-auto">
      <button
        onClick={handleSendEmails}
        disabled={selectedUserIds.length === 0 || sendingEmails}
        className={`w-full px-4 py-2 text-sm rounded-lg flex items-center justify-center ${
          selectedUserIds.length > 0 && !sendingEmails
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {sendingEmails ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t('sending')}
          </>
        ) : (
          t('sendEmails')
        )}
      </button>

      {/* Success/Error Messages displayed below button */}
      {successMessage && (
        <div className="mt-3 bg-green-50 border border-green-200 p-3 rounded-lg animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mt-3 bg-red-50 border border-red-200 p-3 rounded-lg animate-fadeIn">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};