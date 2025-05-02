'use client';

import React, { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Document } from '@/types/document';

// Helper component to render flags dynamically
const LanguageFlag = ({ code }: { code: string | null }) => {
  if (!code || code.length !== 2) {
    return <span className="text-gray-500 text-xs">{code || 'N/A'}</span>; // Fallback for invalid/missing codes
  }

  const FlagComponent = React.lazy(() =>
    import(`country-flag-icons/react/3x2/${code.toUpperCase()}`)
      .catch(() => ({ default: () => <span className="text-gray-500 text-xs">{code}</span> })) // Fallback if import fails
  );

  return (
    <Suspense fallback={<div className="h-4 w-6 bg-gray-200 rounded-sm animate-pulse"></div>}> {/* Loading state */}
      <FlagComponent title={code.toUpperCase()} className="h-4 w-6 rounded-sm shadow-sm" />
    </Suspense>
  );
};

interface DocumentsListProps {
  documents: Document[];
  loading: boolean;
}

export default function DocumentsList({ documents, loading }: DocumentsListProps) {
  const t = useTranslations('DocumentList');

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                <div className="h-4 bg-blue-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!Array.isArray(documents) || documents.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">{t('noDocumentsFound')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('headerTitle')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('headerCategory')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('headerType')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('headerAuthor')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('headerLanguage')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('headerDate')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('headerActions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((doc: Document) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-blue-600 hover:underline">
                  {doc.title}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{doc.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {doc.file_type || 'N/A'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doc.author_name || 'Unknown'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <LanguageFlag code={doc.language ?? null} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">
                  {t('actionView')}
                </button>
                <button className="text-green-600 hover:text-green-900 mr-3">
                  {t('actionDownload')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}