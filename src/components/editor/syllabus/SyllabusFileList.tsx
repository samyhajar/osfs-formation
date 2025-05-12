'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import { SyllabusDocument } from '@/types/document';
import Link from 'next/link';
import { DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { FileIcon } from '@/components/ui/FileIcon';

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
}

export default function SyllabusFileList({
  documents,
  isLoading,
}: SyllabusFileListProps) {
  const t = useTranslations('SyllabusFileList');
  const [generatingUrl, setGeneratingUrl] = useState<string | null>(null);
  const supabase = createClient();
  const locale = useLocale();
  const { profile } = useAuth();
  const userRole = profile?.role || 'editor';

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
    }
  };

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] text-blue-600"></div>
        <p className="mt-4 text-gray-600">{t('loading', { default: 'Loading syllabus documents...' })}</p>
      </div>
    );
  }

  // --- Render Empty State ---
  if (documents.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-gray-300 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">{t('noDocuments', { default: 'No syllabus documents yet' })}</h3>
        <p className="mt-1 text-sm text-gray-500">{t('noDocumentsDetails', { default: 'Syllabus documents will appear here once added by administrators.' })}</p>
      </div>
    );
  }

  // --- Render File Table ---
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('headerName', { default: 'Name' })}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('headerType', { default: 'Type' })}</th>
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
              <tr key={doc.id} className="bg-white hover:bg-gray-50 transition-colors">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.language || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.region || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {doc.category || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(doc.created_at)}
                  {doc.author_name && (
                    <div className="text-xs text-gray-400">
                      {doc.author_name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => { void handleDownload(doc); }}
                    className="text-blue-600 hover:text-blue-800 focus:outline-none flex items-center gap-1"
                    disabled={generatingUrl === doc.id}
                  >
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    <span className="sr-only">
                      {generatingUrl === doc.id
                        ? t('downloading', { default: 'Downloading...' })
                        : t('download', { default: 'Download' })
                      }
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}