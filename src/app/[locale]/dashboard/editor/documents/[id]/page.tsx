'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Document } from '@/types/document';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { DocumentViewer } from '@/components/admin/DocumentViewer/index';

export default function DocumentViewerPage() {
  const params = useParams();
  const documentId = params?.id as string;
  const router = useRouter();
  const { supabase } = useAuth();
  const t = useTranslations('DocumentViewer');

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [generatingUrl, setGeneratingUrl] = useState(false);

  // Generate signed URL for the document
  const generateSignedUrl = useCallback(async (contentUrl: string) => {
    setGeneratingUrl(true);
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(contentUrl, 60 * 60); // 1 hour expiry for viewing

      if (error) {
        throw error;
      }

      if (data?.signedUrl) {
        setSignedUrl(data.signedUrl);
      } else {
        throw new Error(t('signedUrlError'));
      }
    } catch (err) {
      console.error('Error generating signed URL:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setGeneratingUrl(false);
    }
  }, [supabase, t]);

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      if (!documentId) return;

      setLoading(true);
      setError(null);

      try {
        const client = createClient<Database>();
        const { data, error: fetchError } = await client
          .from('documents')
          .select('*')
          .eq('id', documentId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error(t('documentNotFound'));
        }

        // Transform to Document type
        const documentData: Document = {
          id: data.id,
          title: data.title,
          description: data.description || undefined,
          category: data.category,
          file_name: data.title,
          file_type: data.file_type || 'unknown',
          file_size: data.file_size || 0,
          file_path: data.content_url || '',
          file_url: data.content_url || undefined,
          created_at: data.created_at,
          updated_at: data.updated_at || data.created_at,
          created_by: data.author_id || '',
          created_by_name: undefined,
          author_name: data.author_name || undefined,
          content_url: data.content_url || undefined,
          region: data.region || undefined,
          language: data.language || undefined
        };

        setDocument(documentData);

        // Generate signed URL for the document if content_url exists
        if (documentData.content_url) {
          void generateSignedUrl(documentData.content_url);
        }

      } catch (err) {
        console.error('Error fetching document:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void fetchDocument();
  }, [documentId, generateSignedUrl, t]);

  // Handle document download
  const handleDownload = useCallback(async () => {
    if (!document?.content_url) {
      setError(t('noContentUrl'));
      return;
    }

    setGeneratingUrl(true);
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.content_url, 60 * 5); // 5 minute expiry for download

      if (error) {
        throw error;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      } else {
        throw new Error(t('downloadUrlError'));
      }
    } catch (err) {
      console.error('Download failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setGeneratingUrl(false);
    }
  }, [document, supabase, t]);

  // Handle back navigation
  const handleBack = () => router.back();

  if (!document && !loading && !error) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-700">{t('documentNotFound')}</p>
        <button
          onClick={handleBack}
          className="mt-4 inline-flex items-center text-sm font-medium text-red-700 hover:text-red-900"
        >
          {t('goBack')}
        </button>
      </div>
    );
  }

  return (
    <DocumentViewer
      document={document as Document}
      signedUrl={signedUrl}
      loading={loading}
      error={error}
      generatingUrl={generatingUrl}
      onBack={handleBack}
      onDownload={() => { void handleDownload(); }}
      t={t}
    />
  );
}
