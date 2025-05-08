import React from 'react';
import { Document } from '@/types/document';
import { ArrowLeftIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { DocumentHeader } from './DocumentHeader';
import { DocumentDetails } from './DocumentDetails';
import { DocumentContent } from './DocumentContent';

export interface DocumentViewerProps {
  document: Document;
  signedUrl: string | null;
  loading: boolean;
  error: string | null;
  generatingUrl: boolean;
  onBack: () => void;
  onDownload: () => void;
  t: (key: string) => string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  signedUrl,
  loading,
  error,
  generatingUrl,
  onBack,
  onDownload,
  t
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <ArrowPathIcon className="h-10 w-10 mx-auto text-gray-400 animate-spin mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto mt-8">
        <div className="flex items-start">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-medium text-red-800 mb-2">{t('error')}</h2>
            <p className="text-sm text-red-700">{error || t('documentNotFound')}</p>
            <button
              onClick={onBack}
              className="mt-4 inline-flex items-center text-sm font-medium text-red-700 hover:text-red-900"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              {t('goBack')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <DocumentHeader
        document={document}
        generatingUrl={generatingUrl}
        onBack={onBack}
        onDownload={onDownload}
        t={t}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <DocumentDetails document={document} t={t} />
          <DocumentContent
            document={document}
            signedUrl={signedUrl}
            generatingUrl={generatingUrl}
            onDownload={onDownload}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};
