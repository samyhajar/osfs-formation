'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import { SyllabusDocument } from '@/types/document';
import { SyllabusTableRow } from './SyllabusTableRow';
import { EmptyState, LoadingState } from './SyllabusListStates';
import { getLanguageCode } from './LanguageFlag';

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
  onDelete: (documentId: string, filePath: string) => Promise<void>;
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
  const supabase = createClient();

  const toggleDropdown = (docId: string) => {
    setActiveDropdown(activeDropdown === docId ? null : docId);
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
    if (!doc.file_path) {
      alert(t('deleteErrorNoPath', { default: 'Cannot delete: File path is missing.' }));
      return;
    }
    if (!confirm(t('deleteConfirm', { default: `Are you sure you want to delete ${doc.title}?` }))) {
      setActiveDropdown(null);
      return;
    }
    setDeletingFile(doc.id);
    try {
      await onDelete(doc.id, doc.file_path);
    } catch (err) {
      console.error('Deletion failed in component:', err);
      alert(`${t('deleteErrorGeneric', { default: 'Deletion failed:' })} ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeletingFile(null);
      setActiveDropdown(null);
    }
  };

  // --- Render Loading State ---
  if (isLoading) {
    return <LoadingState t={t} />;
  }

  // --- Render Empty State ---
  if (documents.length === 0) {
    return <EmptyState t={t} />;
  }

  // --- Render File Table ---
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('headerName', { default: 'Name' })}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[150px]">{t('headerType', { default: 'Type' })}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('headerLang', { default: 'Lang' })}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('headerRegion', { default: 'Region' })}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('headerCategory', { default: 'Category' })}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('headerCreated', { default: 'Created' })}</th>
              <th scope="col" className="relative px-6 py-3">
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
                deletingFile={deletingFile}
                generatingUrl={generatingUrl}
                toggleDropdown={toggleDropdown}
                handleDownload={handleDownload}
                handleDelete={handleDelete}
                t={t}
                formatDate={formatDate}
                getLanguageCode={getLanguageCode}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}