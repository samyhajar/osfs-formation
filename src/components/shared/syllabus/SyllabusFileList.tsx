'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import { SyllabusDocument } from '@/types/document';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid';
import SyllabusTableRow from './SyllabusTableRow';

const TARGET_BUCKET = 'common-syllabus';

// Helper to format ISO date string
function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return '-';
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(isoString));
  } catch (_e) {
    return 'Invalid Date';
  }
}

interface SyllabusFileListProps {
  documents: SyllabusDocument[];
  isLoading: boolean;
  onDelete?: (documentId: string, filePath: string) => Promise<void>;
}

export default function SyllabusFileList({
  documents,
  isLoading,
  onDelete,
}: SyllabusFileListProps) {
  const t = useTranslations('SyllabusFileList');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [generatingUrl, setGeneratingUrl] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const supabase = createClient();

  // Add global click handler to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-button')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const toggleDropdown = (docId: string, buttonElement?: HTMLButtonElement) => {
    if (activeDropdown === docId) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(docId);

      // Update dropdown position
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right - 150 + window.scrollX, // Position dropdown to the left of the button
        });
      }
    }
  };

  const handleDownload = async (doc: SyllabusDocument) => {
    if (!doc.file_path) {
      alert(t('downloadErrorNoPath', { default: 'File path is missing for this document.' }));
      return;
    }
    setGeneratingUrl(doc.id);
    try {
      const { data, error } = await supabase.storage
        .from(TARGET_BUCKET)
        .createSignedUrl(doc.file_path, 60 * 5);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      } else {
        throw new Error(t('downloadErrorSignUrlFailed', { default: 'Failed to create download link.' }));
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert(`${t('downloadErrorGeneric', { default: 'Download failed:' })} ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setGeneratingUrl(null);
      setActiveDropdown(null);
    }
  };

  const handleDelete = async (doc: SyllabusDocument) => {
    if (!doc.file_path || !onDelete) {
      alert(t('deleteErrorNoPath', { default: 'Cannot delete: File path is missing.' }));
      return;
    }

    if (!confirm(t('deleteConfirmation', { default: 'Are you sure you want to delete this document? This action cannot be undone.' }))) {
      return;
    }

    setDeletingFile(doc.id);
    setActiveDropdown(null);

    try {
      await onDelete(doc.id, doc.file_path);
    } catch (err) {
      console.error('Deletion failed:', err);
      alert(`${t('deleteErrorGeneric', { default: 'Deletion failed:' })} ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeletingFile(null);
    }
  };

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <ArrowPathIcon className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-2" />
        {t('loading', { default: 'Loading syllabus documents...' })}
      </div>
    );
  }

  // --- Render Empty State ---
  if (documents.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MagnifyingGlassIcon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium text-black mb-1">{t('noDocuments', { default: 'No syllabus documents yet' })}</h3>
        <p className="text-gray-500 mb-4">{t('noDocumentsDetails', { default: 'Syllabus documents will appear here once added by administrators.' })}</p>
      </div>
    );
  }

  // --- Render Document Table ---
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                {t('headerName', { default: 'Name' })}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                {t('headerType', { default: 'Type' })}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 hidden sm:table-cell">
                {t('headerLang', { default: 'Lang' })}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 hidden md:table-cell">
                {t('headerRegion', { default: 'Region' })}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28 hidden lg:table-cell">
                {t('headerAuthor', { default: 'Author' })}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 hidden xl:table-cell">
                {t('headerCreated', { default: 'Created' })}
              </th>
              <th scope="col" className="relative px-6 py-3 w-16">
                <span className="sr-only">{t('headerActions', { default: 'Actions' })}</span>
              </th>
            </tr>
          </thead>
                    <tbody className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <SyllabusTableRow
                key={doc.id}
                doc={doc}
                activeDropdown={activeDropdown}
                generatingUrl={generatingUrl}
                deletingFile={deletingFile}
                dropdownPosition={dropdownPosition}
                onToggleDropdown={toggleDropdown}
                onDownload={handleDownload}
                onDelete={onDelete ? handleDelete : undefined}
                formatDate={formatDate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}