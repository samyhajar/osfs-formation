'use client';

import React, { useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { SyllabusDocument } from '@/types/document';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createPortal } from 'react-dom';
import {
  DocumentArrowDownIcon,
  TrashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import {
  EllipsisHorizontalIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { LanguageFlag } from '@/components/admin/syllabus/LanguageFlag';

interface SyllabusTableRowProps {
  doc: SyllabusDocument;
  activeDropdown: string | null;
  generatingUrl: string | null;
  deletingFile: string | null;
  dropdownPosition: { top: number; left: number };
  onToggleDropdown: (docId: string, buttonElement?: HTMLButtonElement) => void;
  onDownload: (doc: SyllabusDocument) => Promise<void>;
  onDelete?: (doc: SyllabusDocument) => Promise<void>;
  formatDate: (date: string | null | undefined) => string;
}

export default function SyllabusTableRow({
  doc,
  activeDropdown,
  generatingUrl,
  deletingFile,
  dropdownPosition,
  onToggleDropdown,
  onDownload,
  onDelete,
  formatDate
}: SyllabusTableRowProps) {
  const t = useTranslations('SyllabusFileList');
  const locale = useLocale();
  const { profile } = useAuth();
  const userRole = profile?.role || 'user';
  const dropdownRef = useRef<HTMLButtonElement>(null);



  const handleDropdownToggle = () => {
    onToggleDropdown(doc.id, dropdownRef.current || undefined);
  };

  const handleDownloadClick = () => {
    void onDownload(doc);
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      void onDelete(doc);
    }
  };



  return (
    <tr
      className={`hover:bg-gray-50/50 transition-colors ${deletingFile === doc.id ? 'opacity-50' : ''}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center mr-4">
            <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-xs font-medium text-blue-700">
                {doc.file_type ? doc.file_type.substring(0, 3).toUpperCase() : 'DOC'}
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900">
              <Link
                href={`/dashboard/${userRole}/documents/syllabus/${doc.id}`}
                as={`/${locale}/dashboard/${userRole}/documents/syllabus/${doc.id}`}
                className="hover:text-accent-primary transition-colors block truncate"
                title={doc.title}
              >
                {doc.title.length > 40 ? `${doc.title.substring(0, 40)}...` : doc.title}
              </Link>
            </div>
            {doc.description && (
              <div className="text-sm text-gray-500 truncate" title={doc.description}>
                {doc.description.length > 50 ? `${doc.description.substring(0, 50)}...` : doc.description}
              </div>
            )}
            {doc.author_name && (
              <div className="text-sm text-gray-500 truncate">
                By {doc.author_name}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
          {doc.file_type ? doc.file_type.toUpperCase() : '-'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
        <LanguageFlag languageName={doc.language || null} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
        {doc.region || '--'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
        {doc.author_name || 'Unknown'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden xl:table-cell">
        {formatDate(doc.created_at)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {/* Show different actions based on user role */}
        {userRole === 'user' ? (
          // Users only get download button
          <button
            onClick={handleDownloadClick}
            disabled={generatingUrl === doc.id}
            className="inline-flex items-center text-gray-500 hover:text-accent-primary focus:outline-none"
            title="Download document"
          >
            {generatingUrl === doc.id ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin" />
            ) : (
              <DocumentArrowDownIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Download</span>
          </button>
        ) : (
          // Admin and Editor get three-dots menu
          <div className="relative">
            <button
              ref={dropdownRef}
              type="button"
              disabled={deletingFile === doc.id}
              onClick={handleDropdownToggle}
              className="dropdown-button text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full disabled:opacity-50"
              aria-label={t('optionsButtonLabel', { default: 'Document options' })}
            >
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {activeDropdown === doc.id && typeof document !== 'undefined' && createPortal(
              <div
                className="fixed syllabus-dropdown shadow-lg bg-white rounded-md ring-1 ring-black ring-opacity-5 z-50"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                }}
              >
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  {/* Only show edit for admin and editor roles */}
                  {(userRole === 'admin' || userRole === 'editor') && (
                    <Link
                      href={`/dashboard/${userRole}/documents/syllabus/${doc.id}/edit`}
                      as={`/${locale}/dashboard/${userRole}/documents/syllabus/${doc.id}/edit`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                      role="menuitem"
                      onClick={() => onToggleDropdown(doc.id)}
                    >
                      <PencilIcon className="h-4 w-4" />
                      {t('edit', { default: 'Edit' })}
                    </Link>
                  )}
                  <button
                    onClick={handleDownloadClick}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    disabled={generatingUrl === doc.id}
                  >
                    <DocumentArrowDownIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    {generatingUrl === doc.id
                      ? t('downloading', { default: 'Downloading...' })
                      : t('download', { default: 'Download' })}
                  </button>
                  {/* Only show delete for admin and editor roles with onDelete function */}
                  {onDelete && (userRole === 'admin' || userRole === 'editor') && (
                    <button
                      onClick={handleDeleteClick}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      disabled={deletingFile === doc.id}
                    >
                      <TrashIcon className="mr-3 h-5 w-5 text-red-400" aria-hidden="true" />
                      {deletingFile === doc.id
                        ? t('deleting', { default: 'Deleting...' })
                        : t('delete', { default: 'Delete' })}
                    </button>
                  )}
                </div>
              </div>,
              document.body
            )}
          </div>
        )}
      </td>
    </tr>
  );
}