'use client';

import { useTranslations } from 'next-intl';
import { Document } from './types';
import { PaginationControls } from '@/components/admin/PaginationControls';
import { DocumentRow } from './DocumentRow';

type DocumentTableProps = {
  loading: boolean;
  paginatedDocuments: Document[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  selectedDocumentIds: string[];
  toggleDocumentSelection: (id: string) => void;
  documentsConfirmed: boolean;
};

export const DocumentTable = ({
  loading,
  paginatedDocuments,
  totalPages,
  currentPage,
  setCurrentPage,
  selectedDocumentIds,
  toggleDocumentSelection,
  documentsConfirmed,
}: DocumentTableProps) => {
  const t = useTranslations('EmailPage');

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                {/* Checkbox column */}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('headerName')}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('headerType')}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('headerLang')}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('headerRegion')}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('headerCategory')}
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('headerCreated')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              // Loading skeletons
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-4 w-4 bg-gray-200 rounded mx-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </td>
                </tr>
              ))
            ) : paginatedDocuments.length > 0 ? (
              paginatedDocuments.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  selected={selectedDocumentIds.includes(doc.id)}
                  documentsConfirmed={documentsConfirmed}
                  onToggle={toggleDocumentSelection}
                  formatDate={formatDate}
                  t={t}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  {t('noDocumentsFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};