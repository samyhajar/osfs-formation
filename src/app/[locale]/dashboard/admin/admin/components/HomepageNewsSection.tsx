'use client';

import { useTranslations } from 'next-intl';
import { HomepageContentForm } from '@/types/homepage';

interface HomepageNewsSectionProps {
  formData: HomepageContentForm;
  onInputChange: (field: keyof HomepageContentForm, value: string | boolean) => void;
}

export function HomepageNewsSection({
  formData,
  onInputChange
}: HomepageNewsSectionProps) {
  const t = useTranslations('HomepageSettings');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('newsSection', { fallback: 'News Section' })}
        </h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.show_news_section}
            onChange={(e) => onInputChange('show_news_section', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">
            {t('showSection', { fallback: 'Show this section' })}
          </span>
        </label>
      </div>

      {formData.show_news_section && (
        <div className="pl-4 border-l-2 border-blue-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('newsTitleLabel', { fallback: 'News Section Title' })}
            </label>
            <input
              type="text"
              value={formData.news_title}
              onChange={(e) => onInputChange('news_title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {t('newsDescription', { fallback: 'News will automatically display recent ordinations, professions, and other milestones.' })}
          </p>
        </div>
      )}
    </div>
  );
}