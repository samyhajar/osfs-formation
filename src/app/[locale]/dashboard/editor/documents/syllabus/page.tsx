'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { SyllabusDocument } from '@/types/document';
import SyllabusUploadForm from '@/components/admin/syllabus/SyllabusUploadForm';
import SyllabusFileList from '@/components/editor/syllabus/SyllabusFileList';
import { PlusIcon } from '@heroicons/react/24/solid';

const TARGET_TABLE = 'syllabus_documents';

export default function CommonSyllabusPage() {
  const t = useTranslations('CommonSyllabusPage');
  const [documents, setDocuments] = useState<SyllabusDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const supabase = createClient<Database>();

  const fetchSyllabusDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from(TARGET_TABLE)
        .select(`
          id,
          title,
          description,
          file_path,
          file_type,
          file_size,
          category,
          author_id,
          author_name,
          created_at,
          updated_at,
          region,
          language,
          topics,
          purpose,
          keywords,
          is_public
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        if (fetchError.message.includes('permission denied')) {
          throw new Error(t('fetchErrorPermission', { default: 'You do not have permission to view these syllabus documents.' }));
        } else {
          throw fetchError;
        }
      }
      setDocuments(data || []);
    } catch (err: unknown) {
      console.error('Error fetching syllabus documents:', err);
      setError(err instanceof Error ? err.message : t('fetchErrorGeneric', { default: 'Failed to load syllabus documents.' }));
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, t]);

  useEffect(() => {
    void fetchSyllabusDocuments();
  }, [fetchSyllabusDocuments]);

  const handleUploadComplete = () => {
    setShowUploadForm(false);
    void fetchSyllabusDocuments();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black">{t('title', { default: 'Common Syllabus Documents' })}</h1>
          <p className="text-gray-500 mt-1">{t('description', { default: 'Upload and manage documents for the common syllabus.' })}</p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          {t('uploadButton', { default: 'Upload New File' })}
        </button>
      </div>

      {showUploadForm && (
        <SyllabusUploadForm onUploadComplete={handleUploadComplete} />
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {t('pageErrorPrefix', { default: 'Error:' })} {error}
        </div>
      )}

      <SyllabusFileList
        documents={documents}
        isLoading={loading}
      />
    </div>
  );
}