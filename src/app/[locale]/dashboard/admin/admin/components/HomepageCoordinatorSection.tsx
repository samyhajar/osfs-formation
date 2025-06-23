'use client';

import { useTranslations } from 'next-intl';
import { HomepageContentForm } from '@/types/homepage';

interface HomepageCoordinatorSectionProps {
  formData: HomepageContentForm;
  onInputChange: (field: keyof HomepageContentForm, value: string | boolean) => void;
}

export function HomepageCoordinatorSection({
  formData,
  onInputChange
}: HomepageCoordinatorSectionProps) {
  const t = useTranslations('HomepageSettings');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('coordinatorSection', { fallback: 'Formation Coordinator Section' })}
        </h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.show_coordinator_section}
            onChange={(e) => onInputChange('show_coordinator_section', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">
            {t('showSection', { fallback: 'Show this section' })}
          </span>
        </label>
      </div>

      {formData.show_coordinator_section && (
        <div className="space-y-4 pl-4 border-l-2 border-blue-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('coordinatorNameLabel', { fallback: 'Coordinator Name' })}
            </label>
            <input
              type="text"
              value={formData.coordinator_name}
              onChange={(e) => onInputChange('coordinator_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Fr. John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('coordinatorMessageLabel', { fallback: 'Coordinator Message' })}
            </label>
            <textarea
              value={formData.coordinator_message}
              onChange={(e) => onInputChange('coordinator_message', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Welcome message from the Formation Coordinator..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('coordinatorImageLabel', { fallback: 'Coordinator Photo URL' })}
            </label>
            <input
              type="url"
              value={formData.coordinator_image_url}
              onChange={(e) => onInputChange('coordinator_image_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>
      )}
    </div>
  );
}