'use client';

import { SyllabusDocument } from '@/types/document';
import { DocumentArrowDownIcon, TrashIcon } from '@heroicons/react/24/solid';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useTranslations, useLocale } from 'next-intl';
import { LanguageFlag } from './LanguageFlag';
import { FileIcon } from '@/components/ui/FileIcon';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Define ReturnType locally since the direct import is causing issues
type TranslatorFunction = ReturnType<typeof useTranslations>;

interface SyllabusTableRowProps {
  doc: SyllabusDocument;
  activeDropdown: string | null;
  deletingFile: string | null;
  generatingUrl: string | null;
  toggleDropdown: (docId: string) => void;
  handleDownload: (doc: SyllabusDocument) => Promise<void>;
  handleDelete: (doc: SyllabusDocument) => void;
  t: TranslatorFunction;
  formatDate: (date: string | null | undefined) => string;
}

export const SyllabusTableRow: React.FC<SyllabusTableRowProps> = ({
  doc,
  activeDropdown,
  deletingFile,
  generatingUrl,
  toggleDropdown,
  handleDownload,
  handleDelete,
  t,
  formatDate
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const locale = useLocale();
  const { profile } = useAuth();
  const userRole = profile?.role || 'user';

  // Adjust dropdown position based on available screen space
  useEffect(() => {
    if (activeDropdown === doc.id && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Check if dropdown would go off-screen vertically
      const bottomSpace = windowHeight - rect.bottom;
      if (bottomSpace < 100) { // If less than 100px from bottom
        setDropdownPosition(prev => ({ ...prev, top: -100 }));
      } else {
        setDropdownPosition(prev => ({ ...prev, top: 0 }));
      }

      // Check if dropdown would go off-screen horizontally
      const rightSpace = windowWidth - rect.right;
      if (rightSpace < 150) { // If less than 150px from right edge
        setDropdownPosition(prev => ({ ...prev, right: 150 }));
      } else {
        setDropdownPosition(prev => ({ ...prev, right: 0 }));
      }
    }
  }, [activeDropdown, doc.id]);

  return (
    <tr className={`bg-white hover:bg-gray-50 transition-colors ${deletingFile === doc.id ? 'opacity-50' : ''}`}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
          <FileIcon fileType={doc.file_type || undefined} size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/dashboard/${userRole}/documents/syllabus/${doc.id}`}
              as={`/${locale}/dashboard/${userRole}/documents/syllabus/${doc.id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block"
            >
              {doc.title}
            </Link>
            {doc.description && (
              <p className="text-xs text-gray-500 truncate">
                {doc.description}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{doc.file_type ? (doc.file_type).toUpperCase() : '—'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <LanguageFlag languageName={doc.language || 'unknown'} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">
          {doc.region || '—'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-900">
          {doc.category || '—'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(doc.created_at)}
        {doc.author_name && (
          <div className="text-xs text-gray-400">
            {doc.author_name}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
        <div className="relative flex justify-end">
          <button
            type="button"
            disabled={deletingFile === doc.id}
            onClick={() => toggleDropdown(doc.id)}
            className="dropdown-button text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full disabled:opacity-50"
            aria-label={t('optionsButtonLabel', { default: 'Document options' })}
          >
            <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          {activeDropdown === doc.id && (
            <div
              ref={dropdownRef}
              style={{
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`,
              }}
              className="absolute z-10 right-0 top-0 mt-8 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <button
                  onClick={() => { void handleDownload(doc); }}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  disabled={generatingUrl === doc.id}
                >
                  <DocumentArrowDownIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                  {generatingUrl === doc.id ? t('downloading', { default: 'Downloading...' }) : t('download', { default: 'Download' })}
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  disabled={deletingFile === doc.id}
                >
                  <TrashIcon className="mr-3 h-5 w-5 text-red-400" aria-hidden="true" />
                  {deletingFile === doc.id ? t('deleting', { default: 'Deleting...' }) : t('delete', { default: 'Delete' })}
                </button>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};