import React from 'react';
import { Document } from '@/types/document';
import { FileIcon } from '@/components/ui/FileIcon';

interface DocumentDetailsProps {
  document: Document;
  t: (key: string) => string;
}

export const DocumentDetails: React.FC<DocumentDetailsProps> = ({
  document,
  t
}) => {
  // Get appropriate file type description
  const getFileTypeDescription = (fileType: string | null): string => {
    if (!fileType) return t('unknown');

    const lowerType = fileType.toLowerCase();

    // Return more descriptive names for common file types
    const fileTypeNames: Record<string, string> = {
      'pdf': 'PDF Document',
      'doc': 'Word Document',
      'docx': 'Word Document',
      'xls': 'Excel Spreadsheet',
      'xlsx': 'Excel Spreadsheet',
      'ppt': 'PowerPoint Presentation',
      'pptx': 'PowerPoint Presentation',
      'txt': 'Text Document',
      'jpg': 'JPEG Image',
      'jpeg': 'JPEG Image',
      'png': 'PNG Image',
      'gif': 'GIF Image',
      'svg': 'SVG Image',
      'pages': 'Apple Pages Document',
      'numbers': 'Apple Numbers Spreadsheet',
      'keynote': 'Apple Keynote Presentation',
    };

    return fileTypeNames[lowerType] || fileType.toUpperCase();
  };

  return (
    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-gray-500 block">{t('fileType')}</span>
          <div className="mt-1 flex items-center">
            <FileIcon fileType={document.file_type ?? undefined} size={16} />
            <span className="ml-2 font-medium">
              {getFileTypeDescription(document.file_type)}
            </span>
          </div>
        </div>
        <div>
          <span className="text-gray-500 block">{t('uploadDate')}</span>
          <span className="font-medium">
            {document.created_at
              ? new Date(document.created_at).toLocaleDateString()
              : t('unknown')}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block">{t('language')}</span>
          <span className="font-medium">
            {document.language || t('unknown')}
          </span>
        </div>
      </div>
    </div>
  );
};