import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { DocumentCategory, DocumentPurpose } from '@/types/document';

interface UseDocumentUpdateProps {
  user: {
    id: string;
  } | null;
  bucketName: string;
  tableName: 'documents' | 'syllabus_documents';
  t: ReturnType<typeof import('next-intl').useTranslations>;
  onSuccess?: () => void;
}

interface DocumentUpdateData {
  title: string;
  description: string;
  category: DocumentCategory;
  authorName: string;
  region: string;
  language: string;
  topics: string[];
  purpose: DocumentPurpose[];
  keywords: string[];
  file: File | null;
}

export function useDocumentUpdate({
  user,
  bucketName,
  tableName,
  t,
  onSuccess,
}: UseDocumentUpdateProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);

  const updateDocument = async (
    documentId: string,
    currentFilePath: string | null,
    data: DocumentUpdateData,
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);

    const {
      title,
      description,
      category,
      authorName,
      region,
      language,
      topics,
      purpose,
      keywords,
      file,
    } = data;

    if (!title || !category) {
      setError(
        t('validationError', { fallback: 'Title and category are required' }),
      );
      setLoading(false);
      return;
    }

    if (!user) {
      setError(
        t('authError', { fallback: 'You must be logged in to edit documents' }),
      );
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient<Database>();
      let newFilePath = currentFilePath;

      // Handle file upload if a new file was selected
      if (file) {
        setProgress(25);
        const filePath = `${user.id}/${Date.now()}-${file.name}`;

        // Delete old file if it exists
        if (currentFilePath) {
          const { error: deleteError } = await supabase.storage
            .from(bucketName)
            .remove([currentFilePath]);

          if (deleteError) {
            console.warn('Failed to delete old file:', deleteError);
          }
        }

        setProgress(50);

        // Upload new file
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          throw new Error(
            t('uploadError', {
              fallback: `File upload failed: ${uploadError.message}`,
            }),
          );
        }

        newFilePath = filePath;
        setProgress(75);
      }

      // Prepare update data based on table
      const updateData =
        tableName === 'documents'
          ? {
              title,
              description: description || null,
              content_url: newFilePath,
              file_type: file ? file.type : undefined,
              file_size: file ? file.size : undefined,
              category,
              author_name: authorName || null,
              region: region || null,
              language: language || null,
              topics: topics.length > 0 ? topics : null,
              purpose: purpose.length > 0 ? purpose : null,
              keywords: keywords.length > 0 ? keywords : null,
              updated_at: new Date().toISOString(),
            }
          : {
              title,
              description: description || null,
              file_path: newFilePath,
              file_type: file ? file.type : undefined,
              file_size: file ? file.size : undefined,
              category,
              author_name: authorName || null,
              region: region || null,
              language: language || null,
              topics: topics.length > 0 ? topics : null,
              purpose: purpose.length > 0 ? purpose : null,
              keywords: keywords.length > 0 ? keywords : null,
              updated_at: new Date().toISOString(),
            };

      const { error: updateError } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', documentId);

      if (updateError) {
        throw new Error(
          t('updateError', {
            fallback: `Update failed: ${updateError.message}`,
          }),
        );
      }

      setProgress(100);
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err) {
      console.error('Error updating document:', err);
      setError(
        err instanceof Error
          ? err.message
          : t('unknownError', { fallback: 'An unknown error occurred' }),
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    updateDocument,
    loading,
    error,
    success,
    progress,
    setError,
  };
}
