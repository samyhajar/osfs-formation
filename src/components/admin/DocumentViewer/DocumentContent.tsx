import React from 'react';
import { Document } from '@/types/document';
import { ArrowDownTrayIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { FileIcon } from '@/components/ui/FileIcon';
import { PDFViewer } from '@/components/shared/PDFViewer';
import { getFileExtension, canDisplayInIframe, getIframeUrl, isPdf, getFileTypeDescription } from '@/lib/utils/file-utils';

interface DocumentContentProps {
  document: Document;
  signedUrl: string | null;
  generatingUrl: boolean;
  onDownload: () => void;
  t: (key: string) => string;
}

export const DocumentContent: React.FC<DocumentContentProps> = ({
  document,
  signedUrl,
  generatingUrl: _generatingUrl,
  onDownload,
  t
}) => {
  // Get the normalized file type
  const fileExtension = getFileExtension(document.file_type, document.file_name);

  console.log('File processing:', {
    originalType: document.file_type,
    fileName: document.file_name,
    extractedExtension: fileExtension
  });

  // Check if it's a PDF
  const isPdfFile = isPdf(document.file_type, document.file_name, fileExtension);

  return (
    <div className="p-2 bg-gray-50 min-h-[70vh]">
      {signedUrl ? (
        canDisplayInIframe(document.file_type, fileExtension) ? (
          <>
            {isPdfFile ? (
              // Use our custom PDF viewer component
              <PDFViewer url={signedUrl} title={document.title} />
            ) : (
              // Use iframe for non-PDF formats
              <iframe
                src={getIframeUrl(signedUrl, document.file_type || '', document.file_name)}
                className="w-full h-[70vh] border-0 rounded"
                title={document.title}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
              />
            )}

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-gray-400 p-2">
                Using viewer URL: {isPdfFile ? signedUrl : getIframeUrl(signedUrl, document.file_type || '', document.file_name)}
              </div>
            )}
          </>
        ) : (
          <PreviewNotAvailable
            document={document}
            signedUrl={signedUrl}
            onDownload={onDownload}
            t={t}
          />
        )
      ) : !document.content_url ? (
        <div className="flex flex-col items-center justify-center h-[70vh] bg-gray-100 rounded">
          <ExclamationTriangleIcon className="h-10 w-10 text-yellow-500 mb-4" />
          <p className="text-gray-700">{t('noContentUrl')}</p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh]">
          <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      )}
    </div>
  );
};

// Helper component for non-previewable files
interface PreviewNotAvailableProps {
  document: Document;
  signedUrl: string | null;
  onDownload: () => void;
  t: (key: string) => string;
}

const PreviewNotAvailable: React.FC<PreviewNotAvailableProps> = ({
  document,
  signedUrl,
  onDownload,
  t
}) => (
  <div className="flex flex-col items-center justify-center h-[70vh] bg-gray-100 rounded">
    <FileIcon fileType={document.file_type ?? undefined} size={48} />
    <h3 className="mt-4 text-lg font-medium text-gray-800">{t('previewNotAvailable')}</h3>

    {/* File type specific messages */}
    {document.file_type?.toLowerCase() === 'pages' && (
      <p className="mt-2 text-gray-600 max-w-md text-center">
        Apple Pages files cannot be previewed directly in the browser.
        Please download the file to view it with Apple Pages or convert it to a compatible format.
      </p>
    )}

    {document.file_type?.toLowerCase() === 'numbers' && (
      <p className="mt-2 text-gray-600 max-w-md text-center">
        Apple Numbers spreadsheets cannot be previewed directly in the browser.
        Please download the file to view it with Apple Numbers or convert it to a compatible format.
      </p>
    )}

    {document.file_type?.toLowerCase() === 'keynote' && (
      <p className="mt-2 text-gray-600 max-w-md text-center">
        Apple Keynote presentations cannot be previewed directly in the browser.
        Please download the file to view it with Apple Keynote or convert it to a compatible format.
      </p>
    )}

    {(['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(document.file_type?.toLowerCase() || '') && !signedUrl) && (
      <p className="mt-2 text-gray-600 max-w-md text-center">
        The Microsoft Office viewer is temporarily unavailable.
        Please try downloading the file instead.
      </p>
    )}

    <p className="mt-2 text-sm text-gray-600">
      {t('fileType')}: {getFileTypeDescription(document.file_type)}
    </p>

    <button
      onClick={onDownload}
      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-primary hover:bg-accent-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
    >
      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
      {t('download')}
    </button>
  </div>
);