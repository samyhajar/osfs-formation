'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentCategory, DocumentPurpose } from '@/types/document';
import { SyllabusFormFields } from './SyllabusFormFields';
import { useDocumentUpdate } from '@/hooks/useDocumentUpdate';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

const TARGET_BUCKET = 'common-syllabus';

interface SyllabusDocumentData {
  id: string;
  title: string;
  description: string | null;
  file_path: string | null;
  file_type: string | null;
  file_size: number | null;
  category: string;
  author_id: string | null;
  author_name: string | null;
  created_at: string;
  updated_at: string | null;
  region: string | null;
  language: string | null;
  topics: string[] | null;
  purpose: string[] | null;
  keywords: string[] | null;
}

interface SyllabusEditFormProps {
  document: SyllabusDocumentData;
  onEditComplete: () => void;
  onCancel: () => void;
}

export function SyllabusEditForm({ document, onEditComplete, onCancel }: SyllabusEditFormProps) {
  const t = useTranslations('SyllabusEdit');
  const { user } = useAuth();

  // Form state
  const [title, setTitle] = useState(document.title);
  const [description, setDescription] = useState(document.description || '');
  const [authorName, setAuthorName] = useState(document.author_name || '');
  const [region, setRegion] = useState(document.region || '');
  const [language, setLanguage] = useState(document.language || '');
  const [topics, setTopics] = useState<string[]>(document.topics || []);
  const [purpose, setPurpose] = useState<DocumentPurpose[]>(document.purpose as DocumentPurpose[] || []);
  const [keywords, setKeywords] = useState<string[]>(document.keywords || []);

  const [file, setFile] = useState<File | null>(null);

  const { updateDocument, loading, error, success, progress } = useDocumentUpdate({
    user,
    bucketName: TARGET_BUCKET,
    tableName: 'syllabus_documents',
    t,
    onSuccess: onEditComplete
  });

  const handleFileUpdate = (newFile: File | null) => {
    setFile(newFile);
  };

  const handlePurposeChange = (option: DocumentPurpose) => {
    setPurpose(prev =>
      prev.includes(option)
        ? prev.filter(p => p !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateDocument(document.id, document.file_path, {
      title,
      description,
      category: document.category as DocumentCategory, // Preserve existing category
      authorName,
      region,
      language,
      topics,
      purpose,
      keywords,
      file
    });
  };

  return (
    <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-100">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {t('editSyllabusTitle', { fallback: 'Edit Syllabus Document' })}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {t('editSyllabusSubtitle', { fallback: 'Update syllabus document information and optionally replace the file' })}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
          {t('updateSuccess', { fallback: 'Syllabus document updated successfully!' })}
        </div>
      )}

      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          {t('currentFileLabel', { fallback: 'Current File' })}
        </h3>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-xs font-medium text-blue-700">
              {document.file_type ? document.file_type.substring(0, 3).toUpperCase() : 'DOC'}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{document.title}</p>
            <p className="text-xs text-gray-500">
              {document.file_type} • {document.file_size ? `${Math.round(document.file_size / 1024)} KB` : 'Unknown size'}
            </p>
          </div>
        </div>
      </div>

      <SyllabusFormFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        file={file}
        handleFileUpdate={handleFileUpdate}
        authorName={authorName}
        setAuthorName={setAuthorName}
        region={region}
        setRegion={setRegion}
        language={language}
        setLanguage={setLanguage}
        topics={topics}
        setTopics={setTopics}
        purpose={purpose}
        handlePurposeChange={handlePurposeChange}
        keywords={keywords}
        setKeywords={setKeywords}
        uploading={loading}
        progress={progress}
        t={t}
        isEditMode={true}
        showCategory={false}
        replaceFileLabel={t('replaceFileLabel', { fallback: 'Replace File (Optional)' })}
        replaceFileHelper={t('replaceFileHelper', { fallback: 'Upload a new file to replace the current one, or leave empty to keep the existing file' })}
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {t('cancelButton', { fallback: 'Cancel' })}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              {t('updatingButton', { fallback: 'Updating...' })}
            </div>
          ) : (
            t('updateButton', { fallback: 'Update Document' })
          )}
        </button>
      </div>
    </form>
  );
}