'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { Database } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { SyllabusFormFields } from './SyllabusFormFields';
import { DocumentCategory, DocumentPurpose } from '@/types/document';

const TARGET_BUCKET = 'common-syllabus';
const TARGET_TABLE = 'syllabus_documents';

type SyllabusDocumentInsert = Database['public']['Tables']['syllabus_documents']['Insert'];

interface SyllabusUploadFormProps {
  onUploadComplete: () => void; // Callback to refresh the file list
}

export default function SyllabusUploadForm({ onUploadComplete }: SyllabusUploadFormProps) {
  const t = useTranslations('SyllabusUploadForm');
  const { user, profile } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>('Articles');
  const [authorName, setAuthorName] = useState('');
  const [region, setRegion] = useState<string>('');
  const [language, setLanguage] = useState<string>('');
  const [topics, setTopics] = useState<string[]>([]);
  const [purpose, setPurpose] = useState<DocumentPurpose[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);


  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileUpdate = (newFile: File | null) => {
    setFile(newFile);
    setError(null);
    setFormError(null);
    setProgress(0);
  };

  const handlePurposeChange = (purp: DocumentPurpose) => {
    setPurpose(prev =>
      prev.includes(purp) ? prev.filter(p => p !== purp) : [...prev, purp]
    );
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setCategory('Articles');
    setRegion('');
    setLanguage('');
    setTopics([]);
    setPurpose([]);
    setKeywords([]);

    setError(null);
    setFormError(null);
    setProgress(0);
  };

  // Wrap handleSubmit to fix the promise-returning function error
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    void handleSubmit(e);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setError(null);

    if (!file || !category || !title) {
      setFormError(t('validationErrorRequired', { default: 'Title, Category, and File are required.' }));
      return;
    }
    if (!user) {
      setFormError(t('validationErrorAuth', { default: 'You must be logged in to upload.' }));
      return;
    }

    setUploading(true);
    setProgress(0);

    const supabase = createClient<Database>();
    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from(TARGET_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error('Storage Upload Error:', uploadError);
        throw new Error(t('storageError', { default: `Storage upload failed: ${uploadError.message}` }));
      }

      const documentData: SyllabusDocumentInsert = {
        title,
        description: description || null,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        category,
        author_id: user.id,
        author_name: authorName || profile?.name || user.email,
        region: region || null,
        language: language || null,
        topics: topics.length > 0 ? topics : null,
        purpose: purpose.length > 0 ? purpose : null,
        keywords: keywords.length > 0 ? keywords : null,

      };

      const { error: insertError } = await supabase
        .from(TARGET_TABLE)
        .insert(documentData);

      if (insertError) {
        console.error('Database Insert Error:', insertError);
        try {
          await supabase.storage.from(TARGET_BUCKET).remove([filePath]);
          console.log('Orphaned file deleted from storage:', filePath);
        } catch (cleanupError) {
          console.error('Failed to delete orphaned file:', cleanupError);
        }
        throw new Error(t('databaseError', { default: `Database insert failed: ${insertError.message}` }));
      }

      setProgress(100);
      resetForm();
      setTimeout(() => {
        setProgress(0);
        onUploadComplete();
      }, 1500);

    } catch (err: unknown) {
      console.error('Upload process failed:', err);
      setError(err instanceof Error ? err.message : t('unknownError', { default: 'An unknown error occurred during upload.' }));
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-100 mb-6">
      <h2 className="text-xl font-semibold text-gray-800">{t('title', { default: 'Upload New Syllabus Document' })}</h2>

      {(formError || error) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
          {formError || error}
        </div>
      )}

      <SyllabusFormFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        file={file}
        handleFileUpdate={handleFileUpdate}
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
        uploading={uploading}
        progress={progress}
        t={t}
      />

      <div className="flex justify-end mt-6 space-x-3">
        <button
          type="button"
          onClick={() => {
            resetForm();
            onUploadComplete();
          }}
          disabled={uploading}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {t('cancelButton', { default: 'Cancel' })}
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              {t('uploadingButton', { default: 'Uploading...' })}
            </div>
          ) : (
            t('submitButton', { default: 'Upload Document' })
          )}
        </button>
      </div>
    </form>
  );
}