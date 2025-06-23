'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { SyllabusEditForm } from '@/components/admin/syllabus/SyllabusEditForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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

export default function EditSyllabusDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const documentId = params?.id as string;
  const t = useTranslations('SyllabusEdit');
  const { user, profile } = useAuth();

  const [document, setDocument] = useState<SyllabusDocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!documentId || !user) return;

      setLoading(true);
      setError(null);

      try {
        const supabase = createClient<Database>();
        const { data, error: fetchError } = await supabase
          .from('syllabus_documents')
          .select('*')
          .eq('id', documentId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error(t('documentNotFound', { fallback: 'Syllabus document not found' }));
        }

        setDocument(data);
      } catch (err) {
        console.error('Error fetching syllabus document:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void fetchDocument();
  }, [documentId, user, t]);

  const handleBack = () => {
    const userRole = profile?.role || 'user';
    router.push(`/${locale}/dashboard/${userRole}/`);
  };

  const handleEditComplete = () => {
    const userRole = profile?.role || 'user';
    router.push(`/${locale}/dashboard/${userRole}/documents/syllabus/${documentId}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t('backToSyllabus', { fallback: 'Back to Syllabus Documents' })}
          </button>
        </div>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t('backToSyllabus', { fallback: 'Back to Syllabus Documents' })}
          </button>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error || t('documentNotFound', { fallback: 'Syllabus document not found' })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t('backToSyllabus', { fallback: 'Back to Syllabus Documents' })}
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('editSyllabusDocument', { fallback: 'Edit Syllabus Document' })}
        </h1>
      </div>

      <SyllabusEditForm
        document={document}
        onEditComplete={handleEditComplete}
        onCancel={handleBack}
      />
    </div>
  );
}