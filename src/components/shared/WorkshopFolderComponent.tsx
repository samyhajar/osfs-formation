'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
  FolderIcon as HeroFolderIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/browser-client';
import JSZip from 'jszip';

interface WorkshopFolderComponentProps {
  basePath: string;
  workshopId: string;
  title: string;
  userRole: 'user' | 'editor' | 'admin' | 'formator' | 'formee';
}

export function WorkshopFolderComponent({
  basePath,
  workshopId,
  title,
  userRole
}: WorkshopFolderComponentProps) {
  const _t = useTranslations();
  const [isDownloading, setIsDownloading] = useState(false);

  const isAdminOrEditor = userRole === 'admin' || userRole === 'editor';
  const href = `${basePath}/${workshopId}`;
  const editHref = `${basePath}/${workshopId}/edit`;

  const handleDownloadFolder = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const supabase = createClient();

      // Fetch workshop data to get file information
      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .select('*')
        .eq('id', workshopId)
        .single();

      if (workshopError) {
        console.error('Error fetching workshop:', workshopError);
        throw workshopError;
      }

      if (!workshopData || !workshopData.file_path) {
        alert('This workshop has no files to download.');
        return;
      }

      const zip = new JSZip();
      const folder = zip.folder(title);
      if (!folder) {
        throw new Error('Failed to create folder in zip');
      }

      try {
        // Get signed URL for the workshop file
        const { data: urlData, error: urlError } = await supabase.storage
          .from('workshops')
          .createSignedUrl(workshopData.file_path, 60 * 5);

        if (urlError || !urlData?.signedUrl) {
          console.error(`Failed to get signed URL for ${title}:`, urlError);
          throw new Error(`Failed to get download URL for ${title}`);
        }

        // Fetch the file content
        const response = await fetch(urlData.signedUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${title}: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Determine file extension
        const fileExtension = workshopData.file_path.split('.').pop() || '';
        const sanitizedTitle = title.replace(/[<>:"/\\|?*]/g, '_');
        const fileName = `${sanitizedTitle}.${fileExtension}`;

        // Add file to zip
        folder.file(fileName, blob);
        console.log(`Added ${fileName} to zip`);

      } catch (err) {
        console.error(`Error downloading ${title}:`, err);
        throw err;
      }

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);

      // Create download link
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `${title.replace(/[<>:"/\\|?*]/g, '_')}_workshop.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(zipUrl);

      console.log(`Successfully downloaded workshop: ${title}`);

    } catch (err) {
      console.error('Failed to download workshop:', err);
      alert(`Failed to download workshop: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative group">
      <Link
        href={href}
        className="group flex flex-col items-center justify-start pt-6 pb-2 px-2 border border-blue-100 rounded-lg text-center cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full h-36 sm:h-40 bg-blue-50 text-blue-800 hover:bg-blue-100 hover:border-blue-200 hover:shadow-sm active:bg-blue-200"
      >
        <HeroFolderIcon className="h-16 w-16 sm:h-20 sm:w-20 mb-2 text-blue-400 group-hover:text-blue-500 transition-colors" />
        <span
          className="text-sm font-medium break-words w-full px-1 overflow-hidden text-ellipsis whitespace-nowrap"
          title={title}
        >
          {title}
        </span>
      </Link>

      {/* Action buttons container */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
        {/* Edit Button - only for admin/editor */}
        {isAdminOrEditor && (
          <Link
            href={editHref}
            onClick={handleEditClick}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title={`Edit ${title} workshop`}
            aria-label={`Edit ${title} workshop`}
          >
            <PencilSquareIcon className="h-4 w-4 text-blue-600" />
          </Link>
        )}

        {/* Download Button */}
        <button
          onClick={(e) => void handleDownloadFolder(e)}
          disabled={isDownloading}
          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title={`Download ${title} workshop`}
          aria-label={`Download ${title} workshop`}
        >
          {isDownloading ? (
            <ArrowPathIcon className="h-4 w-4 text-blue-600 animate-spin" />
          ) : (
            <ArrowDownTrayIcon className="h-4 w-4 text-blue-600" />
          )}
        </button>
      </div>
    </div>
  );
}