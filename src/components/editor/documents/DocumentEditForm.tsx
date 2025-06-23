'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentCategory, DocumentPurpose } from '@/types/document';
import { DocumentFormFields } from '@/components/admin/documents/DocumentFormFields';
import { useDocumentUpdate } from '@/hooks/useDocumentUpdate';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

interface DocumentData {
  id: string;
  title: string;
  description: string | null;
  content_url: string | null;
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

interface DocumentEditFormProps {
  document: DocumentData;
  onEditComplete: () => void;
  onCancel: () => void;
}

const documentCategories: DocumentCategory[] = [
  'Articles', 'Source materials', 'Presentations', 'Formation Programs',
  'Miscellaneous', 'Videos', 'Reflections 4 Dimensions'
];

const documentPurposes: DocumentPurpose[] = [
  'General', 'Novitiate', 'Postulancy', 'Scholasticate', 'Ongoing Formation'
];

const regions = [
  'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'
];

const languages = [
  'English', 'French', 'Spanish', 'German', 'Italian', 'Portuguese', 'Other'
];

export function DocumentEditForm({ document, onEditComplete, onCancel }: DocumentEditFormProps) {
  const t = useTranslations('DocumentEdit');
  const { user } = useAuth();

  // Form state
  const [title, setTitle] = useState(document.title);
  const [description, setDescription] = useState(document.description || '');
  const [category, setCategory] = useState<DocumentCategory>(document.category as DocumentCategory);
  const [authorName, setAuthorName] = useState(document.author_name || '');
  const [region, setRegion] = useState(document.region || '');
  const [language, setLanguage] = useState(document.language || '');
  const [topics, setTopics] = useState<string[]>(document.topics || []);
  const [purpose, setPurpose] = useState<DocumentPurpose[]>(document.purpose as DocumentPurpose[] || []);
  const [keywords, setKeywords] = useState<string[]>(document.keywords || []);

  const [file, setFile] = useState<File | null>(null);

  const { updateDocument, loading, error, success } = useDocumentUpdate({
    user,
    bucketName: 'documents',
    tableName: 'documents',
    t,
    onSuccess: onEditComplete
  });

  const handleFileChange = (newFile: File | null) => {
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

    await updateDocument(document.id, document.content_url, {
      title,
      description,
      category,
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
          {t('editDocumentTitle', { fallback: 'Edit Document' })}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {t('editDocumentSubtitle', { fallback: 'Update document information and optionally replace the file' })}
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
          {t('updateSuccess', { fallback: 'Document updated successfully!' })}
        </div>
      )}

      <DocumentFormFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        file={file}
        handleFileChange={handleFileChange}
        category={category}
        setCategory={setCategory}
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
        disabled={loading}
        t={t}
        documentCategories={documentCategories}
        documentPurposes={documentPurposes}
        regions={regions}
        languages={languages}
        showCurrentFile={true}
        currentDocument={document}
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {t('cancelButton', { fallback: 'Cancel' })}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
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