'use client';

import { useTranslations } from 'next-intl';
import { HomepageContentForm } from '@/types/homepage';

interface HomepageWelcomeSectionProps {
  formData: HomepageContentForm;
  onInputChange: (field: keyof HomepageContentForm, value: string | boolean) => void;
}

export function HomepageWelcomeSection({
  formData,
  onInputChange
}: HomepageWelcomeSectionProps) {
  const t = useTranslations('HomepageSettings');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {t('welcomeSection', { fallback: 'Welcome Section' })}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('welcomeTitleLabel', { fallback: 'Welcome Title' })}
        </label>
        <input
          type="text"
          value={formData.welcome_title}
          onChange={(e) => onInputChange('welcome_title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('welcomeMessageLabel', { fallback: 'Welcome Message' })}
        </label>
        <textarea
          value={formData.welcome_message}
          onChange={(e) => onInputChange('welcome_message', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>
    </div>
  );
}