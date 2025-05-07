'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { useTranslations } from 'next-intl';
import { FileDropzone } from '@/components/admin/documents/FileDropzone';
import { UploadProgress } from '@/components/admin/documents/UploadProgress';
import { FormField } from '@/components/admin/documents/FormField';
import { DatalistField } from '@/components/admin/documents/DatalistField';
import { useAuth } from '@/contexts/AuthContext';

// Common data arrays for form fields
const commonRegions = ['Global', 'Africa', 'Asia', 'Europe', 'North America', 'South America'];
const commonLanguages = ['English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese'];

interface FileUploadFormProps {
  workshopId: string;
  folderPath: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function FileUploadForm({ workshopId: _workshopId, folderPath, onSuccess, onCancel }: FileUploadFormProps) {
  const t = useTranslations('FileUpload');
  const { user, profile } = useAuth();

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [language, setLanguage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setError(null);
    // Set default title from filename if not already set
    if (selectedFile && !title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, '')); // Remove file extension
    }
  };

  const handleSubmit = async () => {
    if (!file || !title) {
      setError(t('validationError'));
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const supabase = createClient<Database>();

      // Construct the file path using the provided folderPath
      const fileExtension = file.name.split('.').pop() || '';
      const sanitizedTitle = title
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_');

      // Add metadata to filename
      const timestamp = Date.now();
      const userIdentifier = user?.id?.slice(0, 8) || 'anonymous';
      const metadata = {
        title,
        region: region || 'no-region',
        language: language || 'no-language',
        created_by: userIdentifier,
        created_by_name: (profile?.name || user?.email || 'unknown').replace(/[^a-zA-Z0-9]/g, '_')
      };

      const metadataString = Object.values(metadata).join('_');
      const fileName = `${sanitizedTitle}_${metadataString}_${timestamp}.${fileExtension}`;

      const filePath = `${folderPath}/${fileName}`
        .replace(/\/+/g, '/') // Replace multiple slashes with single slash
        .replace(/^\/|\/$/g, ''); // Remove leading and trailing slashes

      console.log('Uploading file to:', filePath);

      setUploadProgress(25);

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('workshops')
        .upload(filePath, file, {
          upsert: true, // Allow overwriting if file exists
          contentType: file.type || 'application/octet-stream'
        });

      if (uploadError) throw uploadError;
      setUploadProgress(100);

      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload file';
      setError(message);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl p-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <FormField
            id="title"
            label={t('fieldTitleLabel')}
            value={title}
            onChange={setTitle}
            required
            disabled={uploading}
          />

          <FormField
            id="description"
            label={t('fieldDescriptionLabel')}
            value={description}
            onChange={setDescription}
            isTextArea
            disabled={uploading}
          />

          <DatalistField
            id="region"
            label={t('fieldRegionLabel')}
            value={region}
            onChange={setRegion}
            suggestions={commonRegions}
            listId="common-regions"
            disabled={uploading}
          />

          <DatalistField
            id="language"
            label={t('fieldLanguageLabel')}
            value={language}
            onChange={setLanguage}
            suggestions={commonLanguages}
            listId="common-languages"
            disabled={uploading}
          />
        </div>

        <div className="space-y-6">
          <FileDropzone
            file={file}
            onFileChange={handleFileChange}
            required
          />

          <UploadProgress progress={uploadProgress} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={uploading}
        >
          {t('cancel')}
        </button>
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!file || uploading}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            !file || uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? t('uploading') : t('upload')}
        </button>
      </div>
    </div>
  );
}