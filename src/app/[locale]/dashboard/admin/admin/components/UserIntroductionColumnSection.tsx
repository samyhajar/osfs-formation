'use client';

import { useTranslations } from 'next-intl';
import { EnhancedImageUploadSection } from './EnhancedImageUploadSection';

interface UserIntroductionColumnSectionProps {
  columnType: 'left' | 'right';
  content: string;
  galleryUrls: string[];
  galleryTitles: string[];
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onGalleryUpdate: (urls: string[], titles: string[]) => void;
}

export function UserIntroductionColumnSection({
  columnType,
  content,
  galleryUrls,
  galleryTitles,
  onChange,
  onGalleryUpdate
}: UserIntroductionColumnSectionProps) {
  const t = useTranslations('Admin.userIntroduction');
  const columnName = columnType.charAt(0).toUpperCase() + columnType.slice(1);
  const fieldName = `${columnType}_column_content`;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{columnName} Column</h3>

      <div className="space-y-6">
        <div>
          <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-2">
            {t(`${columnType}ColumnLabel`, { fallback: `${columnName} Column Content` })}
          </label>
          <textarea
            id={fieldName}
            name={fieldName}
            value={content || ''}
            onChange={onChange}
            rows={10}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
            required
          />
        </div>

        <EnhancedImageUploadSection
          galleryUrls={galleryUrls}
          galleryTitles={galleryTitles}
          onGalleryUpdate={onGalleryUpdate}
          columnName={columnName}
          columnType={columnType}
        />
      </div>
    </div>
  );
}