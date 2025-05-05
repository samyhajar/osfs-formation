'use client';

import { ArrowPathIcon, InboxIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

// Using ReturnType to properly type the translator function
type TranslatorFunction = ReturnType<typeof useTranslations>;

interface StateProps {
  t: TranslatorFunction;
}

export function LoadingState({ t }: StateProps) {
  return (
    <div className="p-8 text-center text-gray-500 border border-gray-200 rounded-lg bg-white shadow-sm mt-6">
      <ArrowPathIcon className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-2" />
      {t('loading', { default: 'Loading syllabus documents...' })}
    </div>
  );
}

export function EmptyState({ t }: StateProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-8 text-center bg-white shadow-sm mt-6">
      <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <InboxIcon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-medium text-black mb-1">{t('emptyStateTitle', { default: 'No syllabus documents found' })}</h3>
      <p className="text-gray-500">{t('emptyStateSuggestion', { default: 'Upload the first document using the form above.' })}</p>
    </div>
  );
}