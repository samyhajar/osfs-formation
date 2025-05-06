'use client';

import { CheckIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';

type Document = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

interface DocumentsCardProps {
  documents: Document[];
  loading: boolean;
  selectedDocumentIds: string[];
  documentsConfirmed: boolean;
  toggleDocumentSelection: (id: string) => void;
  confirmDocumentSelection: () => void;
  resetDocumentSelection: () => void;
}

export default function DocumentsCard({
  documents,
  loading,
  selectedDocumentIds,
  documentsConfirmed,
  toggleDocumentSelection,
  confirmDocumentSelection,
  resetDocumentSelection
}: DocumentsCardProps) {
  const t = useTranslations('EmailPage');

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">{t('documentsCard')}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="sr-only">Select</span>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
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
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No documents found
                </td>
              </tr>
            ) : (
              documents.map((document) => (
                <tr
                  key={document.id}
                  className={`
                    ${selectedDocumentIds.includes(document.id) ? 'bg-accent-primary/5' : 'hover:bg-gray-50'}
                    ${!documentsConfirmed ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => !documentsConfirmed && toggleDocumentSelection(document.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-accent-primary border-gray-300 rounded"
                        checked={selectedDocumentIds.includes(document.id)}
                        onChange={() => {}} // Handled by row click
                        disabled={documentsConfirmed}
                        aria-label={`Select ${document.title}`}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{document.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{document.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(document.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        {documentsConfirmed ? (
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              {selectedDocumentIds.length} document(s) selected
            </div>
            <button
              type="button"
              onClick={resetDocumentSelection}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
            >
              Edit Selection
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={confirmDocumentSelection}
              disabled={selectedDocumentIds.length === 0}
              className={`
                inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white
                ${selectedDocumentIds.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-accent-primary hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary'}
              `}
            >
              <CheckIcon className="mr-2 h-4 w-4" />
              {t('confirmDocuments')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}