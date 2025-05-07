'use client';

import React from 'react';
import { Link } from '@/i18n/navigation'; // Use next-intl Link
import { useTranslations } from 'next-intl'; // Import useTranslations
import { FolderIcon as HeroFolderIcon } from '@heroicons/react/24/outline'; // Renamed to avoid conflict

interface FolderComponentProps {
  basePath: string; // Add basePath for dynamic linking
  categoryName: string; // Keep original name for key generation
  categoryTranslationNamespace: string; // Namespace for category keys
  title?: string; // Optional title to display instead of translated category name
}

// Helper to generate translation keys (consistent with others)
const toKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export function FolderComponent({
  basePath,
  categoryName,
  categoryTranslationNamespace,
  title
}: FolderComponentProps) {
  const t = useTranslations(); // Generic translation function

  // Generate the href based on the base path and category name
  const href = `${basePath}/${categoryName}`;

  // Use title if provided, otherwise try to get translation
  const displayName = title || (() => {
    try {
      return t(`${categoryTranslationNamespace}.${toKey(categoryName)}`);
    } catch {
      // If translation fails, use the category name as is
      return categoryName;
    }
  })();

  return (
    <Link
      href={href} // Link component handles locale prefixing
      className="group flex flex-col items-center justify-start pt-6 pb-2 px-2 border border-blue-100 rounded-lg text-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full h-36 sm:h-40 bg-blue-50 text-blue-800 hover:bg-blue-100 hover:border-blue-200 hover:shadow-sm active:bg-blue-200"
    >
      <HeroFolderIcon className="h-16 w-16 sm:h-20 sm:w-20 mb-2 text-blue-400 group-hover:text-blue-500 transition-colors" />
      {/* Display the translated name */}
      <span
        className="text-sm font-medium break-words w-full px-1 overflow-hidden text-ellipsis whitespace-nowrap"
        title={displayName} // Add title attribute for full name on hover
      >
        {displayName}
      </span>
    </Link>
  );
}