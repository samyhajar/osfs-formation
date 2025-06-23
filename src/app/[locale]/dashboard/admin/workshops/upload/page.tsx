'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import MultiFileWorkshopUploadForm from '@/components/admin/workshops/MultiFileWorkshopUploadForm';

export default function UploadWorkshopPage() {
  const router = useRouter();
  const _t = useTranslations('AdminWorkshopsPage');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Upload Workshop</h1>
        <p className="text-gray-600">Upload multiple workshop files at once. Each file will become a separate workshop with its own customizable title.</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <MultiFileWorkshopUploadForm
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