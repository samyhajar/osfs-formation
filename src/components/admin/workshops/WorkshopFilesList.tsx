'use client';

import React, { useState } from 'react';
import { useWorkshopFiles } from '@/hooks/useWorkshopFiles';
import { SimpleDocumentCard } from '@/components/shared/SimpleDocumentCard';
import FileUploadForm from './FileUploadForm';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { Document } from '@/types/document';
import Modal from '@/components/ui/Modal';
import { useTranslations } from 'next-intl';
import { PlusIcon } from '@heroicons/react/24/outline';

interface WorkshopFilesListProps {
  workshopId: string;
  folderPath: string;
  hideUpload?: boolean;
}

export function WorkshopFilesList({ workshopId, folderPath, hideUpload = false }: WorkshopFilesListProps) {
  const { files, loading, error, fetchFiles } = useWorkshopFiles(workshopId, folderPath);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const t = useTranslations('WorkshopFiles');

  const handleDownload = async (document: Document) => {
    const supabase = createClient<Database>();
    const { data, error } = await supabase.storage
      .from('workshops')
      .createSignedUrl(document.file_path, 60); // 60 seconds expiry

    if (error) {
      console.error('Error creating signed URL:', error);
      return;
    }

    // Create a temporary link element and trigger the download
    const link = window.document.createElement('a');
    link.href = data.signedUrl;
    link.download = document.file_name; // Set the download filename
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading files: {error}</div>;
  }

  return (
    <div>
      {!hideUpload && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-700 bg-white rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('uploadFile')}
          </button>
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-gray-500 text-center py-12 bg-white rounded-lg border border-gray-200">
          {t('noFiles')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <SimpleDocumentCard
              key={file.id}
              document={file}
              hideActions={hideUpload}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title={t('uploadFileTitle')}
        size="xl"
      >
        <FileUploadForm
          workshopId={workshopId}
          folderPath={folderPath}
          onSuccess={() => {
            setIsUploadModalOpen(false);
            void fetchFiles();
          }}
          onCancel={() => setIsUploadModalOpen(false)}
        />
      </Modal>
    </div>
  );
}