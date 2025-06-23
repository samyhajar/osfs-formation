'use client';

import { useState } from 'react';
import { MultiFileDropzone, FileWithTitle } from './MultiFileDropzone';
import { MultiFileUploadProgress } from './MultiFileUploadProgress';
import { FormField } from '@/components/admin/documents/FormField';
import { DatalistField } from '@/components/admin/documents/DatalistField';
import { TopicsSelector } from './TopicsSelector';
import { useWorkshopMultiFileUpload } from '@/hooks/useWorkshopMultiFileUpload';
import { commonRegions, commonLanguages, allowedMimeTypes } from './constants';

interface MultiFileWorkshopUploadFormProps {
  onUploadComplete?: () => void;
}

export default function MultiFileWorkshopUploadForm({ onUploadComplete }: MultiFileWorkshopUploadFormProps) {
  // Form state
  const [workshopTitle, setWorkshopTitle] = useState('');
  const [files, setFiles] = useState<FileWithTitle[]>([]);
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  // Use the custom hook for upload logic
  const { uploadWorkshopFiles, loading, error: uploadError, uploadProgress } = useWorkshopMultiFileUpload();

  // State for local form validation error
  const [formError, setFormError] = useState<string | null>(null);

  const handleFilesUpdate = (newFiles: FileWithTitle[]) => {
    // Filter out files with unsupported types
    const validFiles = newFiles.filter(fileWithTitle => {
      if (!allowedMimeTypes.includes(fileWithTitle.file.type)) {
        setFormError(`File "${fileWithTitle.file.name}" has an unsupported type. Please upload common document, image, video, audio, or archive files.`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);
    if (validFiles.length === newFiles.length) {
      setFormError(null);
    }
  };

  const validateForm = () => {
    if (!workshopTitle.trim()) {
      setFormError('Workshop title is required.');
      return false;
    }

    if (!files || files.length === 0) {
      setFormError('At least one file is required.');
      return false;
    }

    // Check for duplicate file titles
    const titles = files.map(f => f.title.toLowerCase().trim());
    const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);
    if (duplicates.length > 0) {
      setFormError('Each file must have a unique title. Please edit the file titles to make them unique.');
      return false;
    }

    // Check for empty file titles
    const emptyTitles = files.filter(f => !f.title.trim());
    if (emptyTitles.length > 0) {
      setFormError('All files must have a title. Please edit the titles for files with empty titles.');
      return false;
    }

    // Validate file types
    const invalidFiles = files.filter(f => !allowedMimeTypes.includes(f.file.type));
    if (invalidFiles.length > 0) {
      setFormError(`The following files have unsupported types: ${invalidFiles.map(f => f.file.name).join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    try {
      await uploadWorkshopFiles({
        workshopTitle: workshopTitle.trim(),
        files,
        description,
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
      className="space-y-6"
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
        id="workshop-title"
        label="Workshop Title"
        value={workshopTitle}
        onChange={setWorkshopTitle}
        required
        disabled={loading}
        placeholder="Enter workshop title..."
      />

      <MultiFileDropzone
        files={files}
        onFilesChange={handleFilesUpdate}
        required
      />

      <MultiFileUploadProgress progress={uploadProgress} />

      <FormField
        id="description"
        label="General Description (Optional)"
        value={description}
        onChange={setDescription}
        isTextArea
        disabled={loading}
        placeholder="Enter a general description that applies to all uploaded files..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <TopicsSelector
        topics={topics}
        onChange={setTopics}
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
          disabled={loading || files.length === 0 || !workshopTitle.trim()}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition-colors ${
            loading || files.length === 0 || !workshopTitle.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? (
            uploadProgress ?
              `Uploading ${uploadProgress.currentFile} of ${uploadProgress.totalFiles}...` :
              'Preparing Upload...'
          ) : (
            `Create Workshop with ${files.length} File${files.length !== 1 ? 's' : ''}`
          )}
        </button>
      </div>
    </form>
  );
}