'use client';

import UploadForm from '@/components/dashboard/documents/UploadForm';

export default function NewDocumentPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Document</h1>
      <UploadForm />
    </div>
  );
}