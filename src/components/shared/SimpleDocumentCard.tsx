'use client';

import React from 'react';
import Link from 'next/link';
import { Document } from '@/types/document';
import { getFileIcon } from '@/lib/utils/file-icons';
import { formatFileSize } from '@/lib/utils/format';

interface SimpleDocumentCardProps {
  document: Document;
  basePath?: string;
  hideActions?: boolean;
}

export function SimpleDocumentCard({
  document,
  basePath = '/dashboard/admin/documents',
  hideActions: _hideActions = false,
}: SimpleDocumentCardProps) {
  const Icon = getFileIcon(document.file_type || document.file_name);

  // Determine the correct link path based on the document type and basePath
  const getLinkPath = () => {
    // For workshop files, use the file path directly as the ID
    if (basePath.includes('/workshops')) {
      // For workshop files, the ID is the file path
      return `/dashboard/admin/workshops/file/${encodeURIComponent(document.file_path)}`;
    }
    // For regular documents, use the document viewer path
    return `${basePath}/${document.id}`;
  };

  return (
    <div className="relative group">
      <Link href={getLinkPath()}>
        <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
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
      </Link>
    </div>
  );
}