import React from 'react';
import { Document } from '@/types/document';
import { ArrowDownTrayIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { FileIcon } from '@/components/ui/FileIcon';
import { PDFViewer } from '@/components/shared/PDFViewer';

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
  // Determine if the file type can be displayed in an iframe
  const canDisplayInIframe = (fileType: string | null): boolean => {
    if (!fileType) return false;

    // Directly supported types that can be rendered in an iframe
    const directlySupportedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'html', 'txt'];

    // Microsoft Office formats that can be viewed via Office Online Viewer
    const officeFormats = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

    return directlySupportedTypes.includes(fileType.toLowerCase()) ||
           officeFormats.includes(fileType.toLowerCase());
  };

  // Get the appropriate URL for displaying in iframe based on file type
  const getIframeUrl = (fileUrl: string, fileType: string): string => {
    const lowerFileType = fileType.toLowerCase();

    // Microsoft Office formats should be viewed via Office Online Viewer
    const officeFormats = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

    if (officeFormats.includes(lowerFileType)) {
      // Use Microsoft Office Online Viewer
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
    }

    // Try Google Docs viewer as a fallback for other supported formats
    const googleSupportedFormats = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
    if (googleSupportedFormats.includes(lowerFileType)) {
      // Use Google Docs Viewer as a fallback option
      return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    }

    // For all other supported formats, use the direct URL
    return fileUrl;
  };

  // Get appropriate file type description
  const getFileTypeDescription = (fileType: string | null): string => {
    if (!fileType) return t('unknown');

    const lowerType = fileType.toLowerCase();

    // Return more descriptive names for common file types
    const fileTypeNames: Record<string, string> = {
      'pdf': 'PDF Document',
      'doc': 'Word Document',
      'docx': 'Word Document',
      'xls': 'Excel Spreadsheet',
      'xlsx': 'Excel Spreadsheet',
      'ppt': 'PowerPoint Presentation',
      'pptx': 'PowerPoint Presentation',
      'txt': 'Text Document',
      'jpg': 'JPEG Image',
      'jpeg': 'JPEG Image',
      'png': 'PNG Image',
      'gif': 'GIF Image',
      'svg': 'SVG Image',
      'pages': 'Apple Pages Document',
      'numbers': 'Apple Numbers Spreadsheet',
      'keynote': 'Apple Keynote Presentation',
    };

    return fileTypeNames[lowerType] || fileType.toUpperCase();
  };

  return (
    <div className="p-2 bg-gray-50 min-h-[70vh]">
      {signedUrl ? (
        canDisplayInIframe(document.file_type) ? (
          <>
            {document.file_type?.toLowerCase() === 'pdf' ? (
              // Use our custom PDF viewer component
              <PDFViewer url={signedUrl} title={document.title} />
            ) : (
              // Use iframe for non-PDF formats
              <iframe
                src={getIframeUrl(signedUrl, document.file_type || '')}
                className="w-full h-[70vh] border-0 rounded"
                title={document.title}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
              />
            )}

            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs text-gray-400 p-2">
                Using viewer URL: {document.file_type?.toLowerCase() === 'pdf' ? signedUrl : getIframeUrl(signedUrl, document.file_type || '')}
              </div>
            )}
          </>
        ) : (
          <PreviewNotAvailable
            document={document}
            signedUrl={signedUrl}
            onDownload={onDownload}
            t={t}
            getFileTypeDescription={getFileTypeDescription}
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
  getFileTypeDescription: (fileType: string | null) => string;
}

const PreviewNotAvailable: React.FC<PreviewNotAvailableProps> = ({
  document,
  signedUrl,
  onDownload,
  t,
  getFileTypeDescription
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
        Please try again later or download the file to view it offline.
      </p>
    )}

    {!['pages', 'numbers', 'keynote', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(document.file_type?.toLowerCase() || '') && (
      <p className="mt-2 text-gray-600 max-w-md text-center">
        This file type ({getFileTypeDescription(document.file_type)}) cannot be previewed directly in the browser.
        Please download to view the contents.
      </p>
    )}

    <button
      onClick={() => void onDownload()}
      disabled={!document.content_url}
      className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
      {t('downloadToView')}
    </button>
  </div>
);