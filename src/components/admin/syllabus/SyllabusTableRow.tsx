'use client';

import { SyllabusDocument } from '@/types/document';
import { DocumentArrowDownIcon, TrashIcon, EllipsisHorizontalIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';
import { LanguageFlag } from './LanguageFlag';
import { FileIcon } from '@/components/ui/FileIcon';

// Define ReturnType locally since the direct import is causing issues
type TranslatorFunction = ReturnType<typeof useTranslations>;

interface SyllabusTableRowProps {
  doc: SyllabusDocument;
  activeDropdown: string | null;
  deletingFile: string | null;
  generatingUrl: string | null;
  toggleDropdown: (docId: string) => void;
  handleDownload: (doc: SyllabusDocument) => Promise<void>;
  handleDelete: (doc: SyllabusDocument) => Promise<void>;
  formatDate: (isoString: string | null | undefined) => string;
  t: TranslatorFunction;
}

// Helper function to get descriptive file type name
const getFileTypeDescription = (fileType: string | null): string => {
  if (!fileType) return 'Unknown';

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

export function SyllabusTableRow({
  doc,
  activeDropdown,
  deletingFile,
  generatingUrl,
  toggleDropdown,
  handleDownload,
  handleDelete,
  formatDate,
  t
}: SyllabusTableRowProps) {
  // Extract file extension from file_type
  const fileExtension = doc.file_type ? doc.file_type.split('/').pop()?.toLowerCase() || null : null;

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs">
        {doc.title}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[150px]">
        <div className="flex items-center">
          <FileIcon fileType={fileExtension || undefined} size={16} className="flex-shrink-0" />
          <span className="ml-2 truncate" title={getFileTypeDescription(fileExtension)}>
            {getFileTypeDescription(fileExtension)}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
        <div className="inline-flex justify-center items-center w-full">
          <LanguageFlag languageName={doc.language ?? null} />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[100px]">
        {doc.region || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[120px]">
        {doc.category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {formatDate(doc.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
        <button
          onClick={() => toggleDropdown(doc.id)}
          disabled={deletingFile === doc.id || generatingUrl === doc.id}
          className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-haspopup="true"
          aria-expanded={activeDropdown === doc.id}
        >
          {(deletingFile === doc.id || generatingUrl === doc.id) ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          ) : (
            <EllipsisHorizontalIcon className="h-5 w-5" />
          )}
        </button>

        {activeDropdown === doc.id && (
          <div
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
            style={{ top: '100%' }}
            onMouseLeave={() => toggleDropdown(doc.id)}
          >
            <div className="py-1" role="menu" aria-orientation="vertical">
              <button
                onClick={() => {
                  void handleDownload(doc);
                }}
                disabled={generatingUrl === doc.id}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                role="menuitem"
              >
                <DocumentArrowDownIcon className="h-4 w-4" />
                {t('actionDownload', { default: 'Download' })}
              </button>
              <button
                onClick={() => {
                  void handleDelete(doc);
                }}
                disabled={deletingFile === doc.id}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                role="menuitem"
              >
                <TrashIcon className="h-4 w-4" />
                {t('actionDelete', { default: 'Delete' })}
              </button>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}