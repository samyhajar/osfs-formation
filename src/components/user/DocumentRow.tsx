'use client';

import Link from 'next/link';
import React, { Suspense } from 'react';
import { Document } from '@/types/document';
import { FileIcon } from '@/components/ui/FileIcon';
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Statically import required flags
import FR from 'country-flag-icons/react/3x2/FR';
import ES from 'country-flag-icons/react/3x2/ES';
import DE from 'country-flag-icons/react/3x2/DE';
import GB from 'country-flag-icons/react/3x2/GB';
import IT from 'country-flag-icons/react/3x2/IT';
import BR from 'country-flag-icons/react/3x2/BR';

// Map country codes to components - use basic object type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const flagComponents: { [key: string]: any } = {
  FR,
  ES,
  DE,
  GB,
  IT,
  BR,
};

// Map full language names (lowercase) to country codes
const languageNameToCodeMap: { [key: string]: string } = {
  english: 'GB',
  french: 'FR',
  spanish: 'ES',
  german: 'DE',
  italian: 'IT',
  portuguese: 'BR',
};

// Updated LanguageFlag component
const LanguageFlag = ({ languageName }: { languageName: string | null }) => {
  if (!languageName) {
    return <span className="text-gray-500 text-xs">N/A</span>;
  }
  const lowerLanguageName = languageName.toLowerCase();
  const countryCode = languageNameToCodeMap[lowerLanguageName];
  if (!countryCode) {
    return <span className="text-gray-500 text-xs">{languageName}</span>;
  }
   
  const FlagComponent = flagComponents[countryCode];
  if (!FlagComponent) {
    return <span className="text-gray-500 text-xs">{countryCode}</span>;
  }
  return (
    <Suspense fallback={<div className="h-4 w-6 bg-gray-200 rounded-sm animate-pulse"></div>}>
      <FlagComponent title={languageName} className="h-4 w-6 rounded-sm shadow-sm" />
    </Suspense>
  );
};

interface DocumentRowProps {
  doc: Document;
  region: string | null | undefined;
  formattedDate: string;
  activeDropdown: string | null;
  generatingUrl: string | null;
  toggleDropdown: (id: string) => void;
  handleDownload: (doc: Document) => Promise<void>;
  onDelete?: (id: string) => void;
}

export function DocumentRow({
  doc,
  region,
  formattedDate,
  generatingUrl,
  handleDownload,
}: DocumentRowProps) {
  const isDownloading = generatingUrl === doc.id;

  const handleDownloadClick = () => {
    void handleDownload(doc);
  };

  return (
    <tr key={doc.id} className="hover:bg-gray-50/50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center mr-4">
            <FileIcon fileType={doc.file_type ?? undefined} size={20} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              <Link href={`/dashboard/documents/${doc.id}`} className="hover:text-accent-primary transition-colors">
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
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={handleDownloadClick}
          disabled={isDownloading}
          className="inline-flex items-center text-gray-500 hover:text-accent-primary focus:outline-none"
          title="Download document"
        >
          {isDownloading ? (
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowDownTrayIcon className="h-5 w-5" />
          )}
          <span className="sr-only">Download</span>
        </button>
      </td>
    </tr>
  );
}