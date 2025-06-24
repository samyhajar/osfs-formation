'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Document } from '@/types/document';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations, useLocale } from 'next-intl';
import { DocumentViewer } from '@/components/admin/DocumentViewer/DocumentViewer';

const TARGET_BUCKET = 'common-syllabus';
const TARGET_TABLE = 'syllabus_documents';

export default function SyllabusDocumentViewerPage() {
  const params = useParams();
  const documentId = params?.id as string;
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { supabase, profile } = useAuth();
  const t = useTranslations('DocumentViewer');

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [generatingUrl, setGeneratingUrl] = useState(false);

  // Generate signed URL for the document
  const generateSignedUrl = useCallback(async (filePath: string) => {
    setGeneratingUrl(true);
    try {
      const { data, error } = await supabase.storage
        .from(TARGET_BUCKET)
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry for viewing

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
          .from(TARGET_TABLE)
          .select('*')
          .eq('id', documentId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error(t('documentNotFound'));
        }

        // Normalize file type
        let normalizedFileType = data.file_type || 'unknown';
        // Convert to lowercase for consistent processing
        normalizedFileType = normalizedFileType.toLowerCase();

        // Extract extension from file path if available
        const extension = data.file_path?.split('.').pop()?.toLowerCase() || '';

        // Map common extensions to proper MIME types
        const mimeTypeMap: Record<string, string> = {
          'pdf': 'application/pdf',
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'xls': 'application/vnd.ms-excel',
          'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'ppt': 'application/vnd.ms-powerpoint',
          'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'txt': 'text/plain'
        };

        // Use extension to determine file type if needed
        if (extension && mimeTypeMap[extension]) {
          normalizedFileType = mimeTypeMap[extension];
        }

        // Transform to Document type
        const documentData: Document = {
          id: data.id,
          title: data.title,
          description: data.description || undefined,
          category: data.category,
          file_name: data.file_path?.split('/').pop() || data.title,
          file_type: normalizedFileType,
          file_size: data.file_size || 0,
          file_path: data.file_path || '',
          file_url: undefined,
          created_at: data.created_at,
          updated_at: data.updated_at || data.created_at,
          created_by: data.author_id || '',
          created_by_name: undefined,
          author_name: data.author_name || undefined,
          content_url: data.file_path || undefined,
          region: data.region || undefined,
          language: data.language || undefined
        };

        console.log('Document data:', documentData);
        console.log('File type:', documentData.file_type);

        setDocument(documentData);

        // Generate signed URL for the document if file_path exists
        if (documentData.file_path) {
          void generateSignedUrl(documentData.file_path);
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
    if (!document?.file_path) {
      setError(t('noContentUrl'));
      return;
    }

    setGeneratingUrl(true);
    try {
      const { data, error } = await supabase.storage
        .from(TARGET_BUCKET)
        .createSignedUrl(document.file_path, 60 * 5); // 5 minute expiry for download

      if (error) {
        throw error;
      }

      if (data?.signedUrl) {
        // Open in new tab for download
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
  const handleBack = useCallback(() => {
    const userRole = profile?.role || 'user';
    console.log('Back navigation - Locale:', locale, 'Profile:', profile, 'UserRole:', userRole);
    console.log('Current pathname:', pathname);

    // Extract locale and role from current pathname as fallback
    const pathSegments = pathname.split('/').filter(Boolean);
    const currentLocale = pathSegments[0] || 'en';
    const currentRole = pathSegments[2] || 'editor'; // dashboard/[role]

    console.log('Path segments:', pathSegments, 'Current locale:', currentLocale, 'Current role:', currentRole);

    const redirectPath = `/${currentLocale}/dashboard/${currentRole}/`;
    console.log('Redirecting to:', redirectPath);
    router.push(redirectPath);
  }, [router, locale, profile, pathname]);

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