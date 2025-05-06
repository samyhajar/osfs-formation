'use client';

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  status?: string | null;
};

interface UsersCardProps {
  users: User[];
  loading: boolean;
  selectedUserIds: string[];
  documentsConfirmed: boolean;
  statusFilter: string;
  sendingEmails: boolean;
  toggleUserSelection: (id: string) => void;
  setStatusFilter: (status: string) => void;
  onSendEmails: (e: React.MouseEvent) => void;
}

export default function UsersCard({
  users,
  loading,
  selectedUserIds,
  documentsConfirmed,
  statusFilter,
  sendingEmails,
  toggleUserSelection,
  setStatusFilter,
  onSendEmails
}: UsersCardProps) {
  const t = useTranslations('EmailPage');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">{t('usersCard')}</h2>
          <div>
            <label htmlFor="status-filter" className="sr-only">{t('statusFilter')}</label>
            <select
              id="status-filter"
              name="status-filter"
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-accent-primary focus:outline-none focus:ring-accent-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">{t('statusFilter')}</option>
              <option value="Scholastic">{t('formeeStatus.Scholastic')}</option>
              <option value="Postulant">{t('formeeStatus.Postulant')}</option>
              <option value="Deacon">{t('formeeStatus.Deacon')}</option>
              <option value="Novice">{t('formeeStatus.Novice')}</option>
              <option value="Other">{t('formeeStatus.Other')}</option>
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="sr-only">Select</span>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  <div className="flex justify-center">
                    <div className="h-5 w-5 border-t-2 border-b-2 border-accent-primary rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className={`
                    ${selectedUserIds.includes(user.id) ? 'bg-accent-primary/5' : 'hover:bg-gray-50'}
                    cursor-pointer
                  `}
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-accent-primary border-gray-300 rounded"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => {}} // Handled by row click
                        aria-label={`Select ${user.name || ''}`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.status || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email || ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            {selectedUserIds.length} recipient(s) selected
          </div>
          <button
            type="button"
            onClick={onSendEmails}
            disabled={!documentsConfirmed || selectedUserIds.length === 0 || sendingEmails}
            className={`
              inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
              ${!documentsConfirmed || selectedUserIds.length === 0 || sendingEmails
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-accent-primary hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary'}
            `}
          >
            {sendingEmails ? (
              <>
                <div className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                Sending...
              </>
            ) : (
              <>
                <EnvelopeIcon className="mr-2 h-4 w-4" />
                {t('sendEmails')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}