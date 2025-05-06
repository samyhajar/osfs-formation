'use client';

import { useTranslations } from 'next-intl';
import EmailClient from '@/components/admin/email/EmailClient';

export default function EmailPage() {
  const t = useTranslations('EmailPage');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-gray-500 mt-1">{t('description')}</p>
      </div>

      <EmailClient />
    </div>
  );
}