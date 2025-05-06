'use client';

import { useTranslations } from 'next-intl';
import EmailClient from '@/components/admin/email/EmailClient';

export default function EmailPage() {
  const t = useTranslations('EmailPage');

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-sm text-gray-600">{t('description')}</p>
      </div>

      <EmailClient />
    </div>
  );
}