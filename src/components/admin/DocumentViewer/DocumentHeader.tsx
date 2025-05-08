import React from 'react';
import { Document } from '@/types/document';
import { ArrowLeftIcon, ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface DocumentHeaderProps {
  document: Document;
  generatingUrl: boolean;
  onBack: () => void;
  onDownload: () => void;
  t: (key: string) => string;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  document,
  generatingUrl,
  onBack,
  onDownload,
  t
}) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Back"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 truncate max-w-2xl" title={document.title}>
                {document.title}
              </h1>
              <p className="text-sm text-gray-500">
                {document.category} • {document.author_name || t('unknownAuthor')}
              </p>
            </div>
          </div>
          <button
            onClick={() => void onDownload()}
            disabled={generatingUrl || !document.content_url}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {generatingUrl ? (
              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            )}
            {generatingUrl ? t('downloading') : t('download')}
          </button>
        </div>
      </div>
    </div>
  );
};