'use client';

import { useState } from 'react';
import { FileDropzone } from '@/components/admin/documents/FileDropzone';
import { UploadProgress } from '@/components/admin/documents/UploadProgress';
import { FormField } from '@/components/admin/documents/FormField';
import { DatalistField } from '@/components/admin/documents/DatalistField';
// import { CheckboxField } from '@/components/admin/documents/CheckboxField';
import { useWorkshopDocumentUpload } from '@/hooks/useWorkshopDocumentUpload';
import { commonRegions, commonLanguages, allowedMimeTypes } from './constants';

interface WorkshopUploadFormProps {
  onUploadComplete?: () => void;
}

export default function WorkshopUploadForm({ onUploadComplete }: WorkshopUploadFormProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [region, setRegion] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  // Use the custom hook for upload logic
  const { uploadWorkshopDocument, loading, error: uploadError, uploadProgress } = useWorkshopDocumentUpload();

  // State for local form validation error
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileUpdate = (newFile: File | null) => {
    setFile(newFile);
    setFormError(null);
    if (newFile && !allowedMimeTypes.includes(newFile.type)) {
      setFormError('This file type is not supported. Please upload a common document, image, video, audio, or archive file.');
      setFile(null);
    }
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!file || !title) {
      setFormError('Title and File are required.');
      return;
    }
    if (!allowedMimeTypes.includes(file.type)) {
      setFormError('This file type is not supported. Please upload a common document, image, video, audio, or archive file.');
      return;
    }

    try {
      await uploadWorkshopDocument({
        title,
        description,
        file,
        region,
        language,
        topics,
        keywords,
      });

      // Reset form on successful upload
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err) {
      // Error handling is managed by the hook
      console.error('Upload failed:', err);
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      {/* Display both form validation errors and upload errors */}
      {(formError || uploadError) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mb-4">
          {formError || uploadError}
        </div>
      )}

      <FormField
        id="title"
        label="Workshop Title"
        value={title}
        onChange={setTitle}
        required
        disabled={loading}
        placeholder="Enter workshop title..."
      />

      <FormField
        id="description"
        label="Description"
        value={description}
        onChange={setDescription}
        isTextArea
        disabled={loading}
        placeholder="Enter workshop description..."
      />

      <FileDropzone
        file={file}
        onFileChange={handleFileUpdate}
        required
      />

      <UploadProgress progress={uploadProgress} />

      <DatalistField
        id="region"
        label="Region"
        value={region}
        onChange={setRegion}
        suggestions={commonRegions}
        listId="common-regions"
        disabled={loading}
      />

      <DatalistField
        id="language"
        label="Language"
        value={language}
        onChange={setLanguage}
        suggestions={commonLanguages}
        listId="common-languages"
        disabled={loading}
      />

      <FormField
        id="topics-input"
        label="Topics (comma-separated)"
        value={topics.join(', ')}
        onChange={(value) => setTopics(value.split(',').map(t => t.trim()).filter(t => t))}
        placeholder="e.g., Theology, Spirituality, History"
        disabled={loading}
      />

      <FormField
        id="keywords-input"
        label="Keywords (comma-separated)"
        value={keywords.join(', ')}
        onChange={(value) => setKeywords(value.split(',').map(k => k.trim()).filter(k => k))}
        placeholder="e.g., Vocation, Formation, Prayer"
        disabled={loading}
      />

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading || !file}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition-colors ${
            loading || !file
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? 'Uploading...' : 'Upload Workshop File'}
        </button>
      </div>
    </form>
  );
}