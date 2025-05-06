'use client';

import { useTranslations } from 'next-intl';
import { Document } from './types';
import { LanguageFlag } from './LanguageFlag';
import { DocumentFilters } from './types';
import { EmailFilters } from './EmailFilters';
import { DocumentTable } from './DocumentTable';

// Number of items to display per page
const ITEMS_PER_PAGE = 5;

type DocumentsTableProps = {
  documents: Document[];
  selectedDocumentIds: string[];
  toggleDocumentSelection: (id: string) => void;
  documentsConfirmed: boolean;
  loading: boolean;
  currentDocumentPage: number;
  setCurrentDocumentPage: (page: number) => void;
  documentFilters: DocumentFilters;
  handleFilterChange: (filters: Partial<DocumentFilters>) => void;
  confirmDocumentSelection: () => void;
  resetDocumentSelection: (clearSelection?: boolean) => void;
};

export const DocumentsTable = ({
  documents,
  selectedDocumentIds,
  toggleDocumentSelection,
  documentsConfirmed,
  loading,
  currentDocumentPage,
  setCurrentDocumentPage,
  documentFilters,
  handleFilterChange,
  confirmDocumentSelection,
  resetDocumentSelection,
}: DocumentsTableProps) => {
  const t = useTranslations('EmailPage');

  // Pagination calculations for documents
  const totalDocumentPages = Math.ceil(documents.length / ITEMS_PER_PAGE);
  const documentStartIndex = (currentDocumentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDocuments = documents.slice(documentStartIndex, documentStartIndex + ITEMS_PER_PAGE);

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
    <div className={`${documentsConfirmed ? 'w-5/12' : 'w-full'} transition-all duration-300`}>
      {/* Only show title on first step */}
      {!documentsConfirmed && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">{t('documents')}</h2>

          {/* Document Filters - Only show if documents not confirmed */}
          <EmailFilters
            filters={documentFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      {/* Documents Table - Only show if documents not confirmed */}
      {!documentsConfirmed ? (
        <>
          <DocumentTable

            loading={loading}
            paginatedDocuments={paginatedDocuments}
            totalPages={totalDocumentPages}
            currentPage={currentDocumentPage}
            setCurrentPage={setCurrentDocumentPage}
            selectedDocumentIds={selectedDocumentIds}
            toggleDocumentSelection={toggleDocumentSelection}
            documentsConfirmed={documentsConfirmed}
          />

          {/* Document Selection Actions */}
          <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {selectedDocumentIds.length > 0 ? (
                <span>{t('selectedDocuments', { count: selectedDocumentIds.length })}</span>
              ) : (
                <span>{t('noDocumentsSelected')}</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={(_e) => resetDocumentSelection()}
                disabled={selectedDocumentIds.length === 0}
                className={`px-3 py-1.5 text-sm rounded-lg border ${
                  selectedDocumentIds.length > 0
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t('reset')}
              </button>
              <button
                onClick={confirmDocumentSelection}
                disabled={selectedDocumentIds.length === 0}
                className={`px-3 py-1.5 text-sm rounded-lg border ${
                  selectedDocumentIds.length > 0
                    ? 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t('next')}
              </button>
            </div>
          </div>
        </>
      ) : (
        <SelectedDocumentsSummary
          documents={documents}
          selectedDocumentIds={selectedDocumentIds}
          resetDocumentSelection={resetDocumentSelection}
          formatDate={formatDate}
          t={t}
        />
      )}
    </div>
  );
};

type SelectedDocumentsSummaryProps = {
  documents: Document[];
  selectedDocumentIds: string[];
  resetDocumentSelection: (clearSelection?: boolean) => void;
  formatDate: (dateString: string) => string;
  t: (key: string, options?: Record<string, string | number>) => string;
};

const SelectedDocumentsSummary = ({
  documents,
  selectedDocumentIds,
  resetDocumentSelection,
  formatDate,
  t
}: SelectedDocumentsSummaryProps) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{t('selectedDocuments', { count: selectedDocumentIds.length })}</h3>
          <button
            onClick={(e) => {
              e.preventDefault();
              resetDocumentSelection(false);
            }}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {t('change')}
          </button>
        </div>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-2">
          {documents
            .filter(doc => selectedDocumentIds.includes(doc.id))
            .map(doc => (
              <div key={doc.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-700">
                      {doc.file_type ? doc.file_type.substring(0, 3).toUpperCase() : 'DOC'}
                    </span>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                    <div className="text-xs text-gray-500">
                      {doc.category} • {formatDate(doc.created_at)}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <LanguageFlag languageName={doc.language ?? null} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};