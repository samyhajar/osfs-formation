'use client';

import { useTranslations } from 'next-intl';

interface UserIntroductionCoordinatorSectionProps {
  coordinatorName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UserIntroductionCoordinatorSection({
  coordinatorName,
  onChange
}: UserIntroductionCoordinatorSectionProps) {
  const t = useTranslations('Admin.userIntroduction');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">General Information</h3>
      <div>
        <label htmlFor="coordinator_name" className="block text-sm font-medium text-gray-700 mb-2">
          {t('coordinatorNameLabel', { fallback: 'General Coordinator Name' })}
        </label>
        <input
          type="text"
          id="coordinator_name"
          name="coordinator_name"
          value={coordinatorName || ''}
          onChange={onChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-accent-primary"
          required
        />
      </div>
    </div>
  );
}