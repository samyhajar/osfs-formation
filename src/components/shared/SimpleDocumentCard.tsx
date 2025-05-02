'use client';

import React, { useState } from 'react';
import { Document } from '@/types/document';
import { FileIcon } from '@/components/ui/FileIcon';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import toast from 'react-hot-toast';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface SimpleDocumentCardProps {
  document: Document;
}

export function SimpleDocumentCard({ document }: SimpleDocumentCardProps) {
  const { title, author_name, file_type, content_url, id } = document;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!content_url) {
      toast.error('File path is missing, cannot download.');
      console.error('Missing content_url for document:', id);
      return;
    }
    if (isDownloading) return;

    setIsDownloading(true);
    const toastId = toast.loading('Preparing download...');

    try {
      const supabase = createClient<Database>();
      const { data, error } = await supabase.storage
        .from('documents') // Corrected bucket name
        .createSignedUrl(content_url, 60 * 5); // 5-minute validity

      if (error) throw error;

      if (data?.signedUrl) {
        // Use window.open for direct download prompt in most browsers
        window.open(data.signedUrl, '_blank');
        toast.success('Download started!', { id: toastId });
      } else {
        throw new Error('Failed to generate download link.');
      }
    } catch (err: unknown) {
      console.error('Download error:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast.error(`Download failed: ${message}`, { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleDownload()}
      disabled={isDownloading || !content_url}
      className="group flex flex-col items-center text-center p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md w-24 disabled:opacity-50 disabled:cursor-not-allowed"
      title={`Download ${title}`}
    >
      {/* Larger Icon Representation */}
      <div className="relative mb-2 flex flex-col items-center">
         {isDownloading ? (
           <ArrowPathIcon className="h-16 w-16 sm:h-16 sm:w-16 text-gray-400 animate-spin" />
         ) : (
           <FileIcon fileType={file_type ?? undefined} size={64} className="transition-transform duration-150 group-hover:scale-105" />
         )}
        {/* File Type Text Below Icon */}
        {file_type && !isDownloading && (
          <span className="mt-1 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
            {file_type}
          </span>
        )}
        {/* Placeholder for spacing if no file type */}
        {!file_type && !isDownloading && <div className="h-[15px] mt-1"></div>}
      </div>

      {/* Text Content Below Icon Area */}
      <div className="w-full">
        <h3 className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-600 mb-0.5 line-clamp-2 break-words">
          {title}
        </h3>
        <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-1 break-words">
          By {author_name || 'Unknown Author'}
        </p>
      </div>
    </button>
  );
}