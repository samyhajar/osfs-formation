'use client';

import { useTranslations } from 'next-intl';
import { HomepageContentForm } from '@/types/homepage';

interface HomepageQuoteSectionProps {
  formData: HomepageContentForm;
  onInputChange: (field: keyof HomepageContentForm, value: string | boolean) => void;
}

export function HomepageQuoteSection({
  formData,
  onInputChange
}: HomepageQuoteSectionProps) {
  const t = useTranslations('HomepageSettings');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {t('quoteSection', { fallback: 'Quote Section' })}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('quoteTextLabel', { fallback: 'Quote Text' })}
          </label>
          <input
            type="text"
            value={formData.quote_text}
            onChange={(e) => onInputChange('quote_text', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('quoteTranslationLabel', { fallback: 'Quote Translation' })}
          </label>
          <input
            type="text"
            value={formData.quote_translation}
            onChange={(e) => onInputChange('quote_translation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}