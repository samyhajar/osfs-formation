'use client';

import { useTranslations } from 'next-intl';
import { HomepageContentForm } from '@/types/homepage';

interface HomepageMainTitleSectionProps {
  formData: HomepageContentForm;
  onInputChange: (field: keyof HomepageContentForm, value: string | boolean) => void;
}

export function HomepageMainTitleSection({
  formData,
  onInputChange
}: HomepageMainTitleSectionProps) {
  const t = useTranslations('HomepageSettings');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {t('mainTitleSection', { fallback: 'Main Title Section' })}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('titleLabel', { fallback: 'Main Title' })}
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('subtitleLabel', { fallback: 'Subtitle' })}
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => onInputChange('subtitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>
    </div>
  );
}