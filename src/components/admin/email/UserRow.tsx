'use client';

import { User } from './types';

type UserRowProps = {
  user: User;
  selected: boolean;
  toggleUserSelection: (id: string) => void;
  t: (key: string, options?: Record<string, string | number>) => string;
};

export const UserRow = ({ user, selected, toggleUserSelection, t }: UserRowProps) => {
  return (
    <tr
      onClick={() => toggleUserSelection(user.id)}
      className={`hover:bg-gray-50 cursor-pointer ${
        selected ? 'bg-blue-50' : ''
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap flex items-center justify-center">
        <div className={`h-5 w-5 rounded border flex items-center justify-center ${
          selected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
        }`}>
          {selected && (
            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="text-sm font-medium text-gray-900">{user.name || t('unnamed')}</div>
        <div className="text-xs text-gray-500">{user.role}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        {user.status && (
          <span className={`px-2 py-1 text-xs rounded-full inline-block ${
            user.status === 'active' ? 'bg-green-100 text-green-800' :
            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {user.status}
          </span>
        )}
      </td>
    </tr>
  );
};