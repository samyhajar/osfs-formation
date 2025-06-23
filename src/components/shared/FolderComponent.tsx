'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/navigation'; // Use next-intl Link
import { useTranslations } from 'next-intl'; // Import useTranslations
import { FolderIcon as HeroFolderIcon, ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline'; // Renamed to avoid conflict
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { convertToDocuments } from '@/lib/utils/document-utils';
import JSZip from 'jszip';

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
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownloadFolder = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const supabase = createClient();

      // Fetch all documents in this category
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('category', categoryName as Database['public']['Enums']['document_category'])
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching documents:', fetchError);
        throw fetchError;
      }

      const documents = convertToDocuments(data);

      if (documents.length === 0) {
        alert('This folder is empty - no documents to download.');
        return;
      }

      const zip = new JSZip();

      // Create a folder in the zip with the category name
      const folder = zip.folder(categoryName);
      if (!folder) {
        throw new Error('Failed to create folder in zip');
      }

      // Download all documents and add them to the zip
      const downloadPromises = documents.map(async (doc) => {
        if (!doc.content_url) {
          console.warn(`Skipping document ${doc.title} - no content URL`);
          return;
        }

        try {
          // Get signed URL for the document
          const { data: urlData, error: urlError } = await supabase.storage
            .from('documents')
            .createSignedUrl(doc.content_url, 60 * 5);

          if (urlError || !urlData?.signedUrl) {
            console.error(`Failed to get signed URL for ${doc.title}:`, urlError);
            return;
          }

          // Fetch the file content
          const response = await fetch(urlData.signedUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${doc.title}: ${response.statusText}`);
          }

          const blob = await response.blob();

          // Determine file extension
          const fileExtension = doc.file_type ?
            (doc.file_type.startsWith('.') ? doc.file_type : `.${doc.file_type}`) :
            '';

          // Sanitize filename for zip
          const sanitizedTitle = doc.title.replace(/[<>:"/\\|?*]/g, '_');
          const fileName = `${sanitizedTitle}${fileExtension}`;

          // Add file to zip
          folder.file(fileName, blob);
          console.log(`Added ${fileName} to zip`);

        } catch (err) {
          console.error(`Error downloading ${doc.title}:`, err);
          // Continue with other files even if one fails
        }
      });

      // Wait for all downloads to complete
      await Promise.all(downloadPromises);

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);

      // Create download link
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `${categoryName.replace(/[<>:"/\\|?*]/g, '_')}_documents.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(zipUrl);

      console.log(`Successfully downloaded folder: ${categoryName}`);

    } catch (err) {
      console.error('Failed to download folder:', err);
      alert(`Failed to download folder: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative group">
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

      {/* Download Button - appears on hover */}
      <button
        onClick={(e) => void handleDownloadFolder(e)}
        disabled={isDownloading}
        className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed z-10"
        title={`Download ${displayName} folder`}
        aria-label={`Download ${displayName} folder`}
      >
        {isDownloading ? (
          <ArrowPathIcon className="h-5 w-5 text-blue-600 animate-spin" />
        ) : (
          <ArrowDownTrayIcon className="h-5 w-5 text-blue-600" />
        )}
      </button>
    </div>
  );
}