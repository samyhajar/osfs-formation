'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Document, DocumentCategory } from '@/types/document';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { DocumentViewer } from '@/components/admin/DocumentViewer';

export default function WorkshopFileViewerPage() {
  const params = useParams();
  const fileId = params?.id as string;
  const router = useRouter();
  const { supabase } = useAuth();
  const t = useTranslations('DocumentViewer'); // Reuse document viewer translations

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [generatingUrl, setGeneratingUrl] = useState(false);
  const [workshopTitle, setWorkshopTitle] = useState<string | null>(null);

  // Fetch file data directly from storage
  useEffect(() => {
    // Generate signed URL for the file
    const generateSignedUrl = async (filePath: string) => {
      setGeneratingUrl(true);
      try {
        const { data, error } = await supabase.storage
          .from('workshops')
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
    };

    const fetchFile = async () => {
      if (!fileId) return;

      setLoading(true);
      setError(null);

      try {
        // The fileId is actually the file path in the storage bucket
        const filePath = decodeURIComponent(fileId);

        // Extract file name from path
        const fileName = filePath.split('/').pop() || 'Unknown file';

        // Try to extract workshop name from path
        const pathParts = filePath.split('/');
        if (pathParts.length > 1) {
          // The workshop name is likely the folder name
          setWorkshopTitle(pathParts[0]);
        }

        // Extract file type from file name
        const fileType = fileName.split('.').pop()?.toLowerCase() || 'unknown';

        // Create a document object from the file path
        const documentData: Document = {
          id: fileId,
          title: fileName,
          description: undefined,
          category: 'Miscellaneous' as DocumentCategory,
          file_name: fileName,
          file_type: fileType,
          file_size: 0, // We don't know the size without metadata
          file_path: filePath,
          file_url: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: '',
          created_by_name: undefined,
          author_name: workshopTitle || undefined,
          content_url: filePath,
          region: undefined,
          language: undefined
        };

        setDocument(documentData);

        // Generate signed URL for the file
        void generateSignedUrl(filePath);

      } catch (err) {
        console.error('Error fetching file:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void fetchFile();
  }, [fileId, supabase, t, workshopTitle]);

  // Handle file download
  const handleDownload = async () => {
    if (!document?.file_path) {
      setError(t('noContentUrl'));
      return;
    }

    setGeneratingUrl(true);
    try {
      const { data, error } = await supabase.storage
        .from('workshops')
        .createSignedUrl(document.file_path, 60 * 5); // 5 minute expiry for download

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
  };

  if (!document && !loading && !error) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-700">{t('documentNotFound')}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 hover:text-blue-800"
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
      onBack={() => router.back()}
      onDownload={handleDownload}
      t={t}
    />
  );
}