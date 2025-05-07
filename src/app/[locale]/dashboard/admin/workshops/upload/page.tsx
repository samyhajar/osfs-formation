'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import WorkshopUploadForm from '@/components/admin/workshops/WorkshopUploadForm';

export default function UploadWorkshopPage() {
  const router = useRouter();
  const t = useTranslations('AdminWorkshopsPage');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('uploadWorkshopTitle')}</h1>
        <p className="text-gray-600">{t('uploadWorkshopDescription')}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <WorkshopUploadForm
          onUploadComplete={() => {
            // Redirect back to workshops page after successful upload
            router.push('/en/dashboard/admin/workshops');
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}