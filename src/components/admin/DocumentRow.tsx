'use client';

import Link from 'next/link';
import React, { useRef, useEffect, useState } from 'react';
import { Document } from '@/types/document';
import { FileIcon } from '@/components/ui/FileIcon';
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';
import LanguageFlag from '@/components/ui/LanguageFlag';

interface DocumentRowProps {
  doc: Document;
  region: string | null | undefined;
  formattedDate: string;
  activeDropdown: string | null;
  generatingUrl: string | null;
  toggleDropdown: (id: string) => void;
  handleDownload: (doc: Document) => Promise<void>; // Ensure this is async
  onDelete?: (id: string) => void; // Optional delete handler
}

export function DocumentRow({
  doc,
  region,
  formattedDate,
  activeDropdown,
  generatingUrl,
  toggleDropdown,
  handleDownload,
  onDelete,
}: DocumentRowProps) {
  const isDropdownOpen = activeDropdown === doc.id;
  const isDownloading = generatingUrl === doc.id;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleDeleteClick = () => {
    if (onDelete) {
      // Remove window.confirm and directly call onDelete
      onDelete(doc.id);
      toggleDropdown(doc.id); // Close dropdown after action
    }
  };

  const handleDownloadClick = () => {
    void handleDownload(doc); // Correctly call async function
    // Keep dropdown open during download generation
  };

  // Update dropdown position whenever it opens
  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 150 + window.scrollX, // Position dropdown to the left of the button
      });
    }
  }, [isDropdownOpen]);

  return (
    <tr key={doc.id} className="hover:bg-gray-50/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center mr-4">
            <FileIcon fileType={doc.file_type ?? undefined} size={20} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              <Link href={`/dashboard/admin/documents/${doc.id}`} className="hover:text-accent-primary transition-colors">
                {doc.title}
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              By {doc.author_name || 'Unknown Author'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
          {doc.file_type ? doc.file_type.toUpperCase() : '-'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        <LanguageFlag languageName={doc.language ?? null} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {region || '--'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {doc.category || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {formattedDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
        <button
          ref={buttonRef}
          onClick={() => toggleDropdown(doc.id)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-md hover:bg-gray-100"
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
        >
          <EllipsisHorizontalIcon className="h-5 w-5" />
        </button>

        {isDropdownOpen && typeof document !== 'undefined' && createPortal(
          <div
            className="fixed shadow-lg bg-white rounded-md ring-1 ring-black ring-opacity-5 z-50"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <Link
                href={`/dashboard/admin/documents/${doc.id}`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                role="menuitem"
                onClick={() => toggleDropdown(doc.id)} // Close dropdown on click
              >
                <EyeIcon className="h-4 w-4" />
                View
              </Link>
              <Link
                href={`/dashboard/admin/documents/${doc.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                role="menuitem"
                onClick={() => toggleDropdown(doc.id)} // Close dropdown on click
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </Link>
              <button
                onClick={handleDownloadClick}
                disabled={isDownloading}
                className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${isDownloading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                role="menuitem"
              >
                {isDownloading ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowDownTrayIcon className="h-4 w-4" />
                )}
                {isDownloading ? 'Generating...' : 'Download'}
              </button>
              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 w-full text-left"
                  role="menuitem"
                >
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>,
          document.body
        )}
      </td>
    </tr>
  );
}