'use client';

import React from 'react';
import { Document } from '@/types/document';
import { getFileIcon } from '@/lib/utils/file-icons';
import { formatFileSize } from '@/lib/utils/format';
import { useTranslations } from 'next-intl';

interface SimpleDocumentCardProps {
  document: Document;
  hideActions?: boolean;
  onDownload?: (document: Document) => Promise<void>;
}

export function SimpleDocumentCard({ document, hideActions = false, onDownload }: SimpleDocumentCardProps) {
  const t = useTranslations('DocumentCard');
  const Icon = getFileIcon(document.file_type || document.file_name);

  return (
    <div className="relative group">
      <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-gray-400">
          <Icon className="w-8 h-8" />
      </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-900 truncate" title={document.title}>
            {document.title}
        </h3>
          <p className="mt-1 text-xs text-gray-500">
            {formatFileSize(document.file_size)}
        </p>
        </div>
      </div>

      {!hideActions && onDownload && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              void onDownload(document);
            }}
            className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-100 transition-colors"
          >
            {t('download')}
    </button>
        </div>
      )}
    </div>
  );
}