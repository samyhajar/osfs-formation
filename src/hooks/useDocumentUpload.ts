'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { DocumentCategory, DocumentPurpose } from '@/types/document';
import { useAuth } from '@/contexts/AuthContext';

// Define the structure for document insertion from the DB types
type DocumentInsert = Database['public']['Tables']['documents']['Insert'];

// Define the shape of the data the hook needs
interface UploadData {
  title: string;
  description: string;
  file: File;
  category: DocumentCategory;
  region: string;
  language: string;
  topics: string[];
  purpose: DocumentPurpose[];
  keywords: string[];
  isPublic: boolean;
}

interface UseDocumentUploadResult {
  uploadDocument: (data: UploadData) => Promise<void>;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

export function useDocumentUpload(): UseDocumentUploadResult {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadDocument = async (data: UploadData): Promise<void> => {
    if (!user) {
      setError('User not authenticated.');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);
    const supabase = createClient<Database>();
    const filePath = `${user.id}/${Date.now()}-${data.file.name.replace(
      /[^a-zA-Z0-9_.-]/g,
      '_',
    )}`;
    const fileExt = data.file.name.split('.').pop()?.toLowerCase();

    try {
      console.log(`Uploading file to path: ${filePath}`);
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, data.file, {
          cacheControl: '3600',
          upsert: false,
          contentType: data.file.type || 'application/octet-stream',
        });

      if (uploadError) {
        console.error('Storage Upload Error:', uploadError);
        throw new Error(`Storage Error: ${uploadError.message}`);
      }
      console.log('File uploaded to storage.');
      setUploadProgress(50); // Halfway point

      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      if (!urlData?.publicUrl) {
        throw new Error('Could not get public URL after upload.');
      }
      console.log(`Public URL obtained: ${urlData.publicUrl}`);

      const documentData: DocumentInsert = {
        title: data.title,
        description: data.description || null,
        content_url: filePath, // Store relative path
        file_type: fileExt || null,
        file_size: data.file.size,
        category: data.category,
        author_id: user.id,
        author_name:
          (user.user_metadata?.name as string) || user.email || 'Unknown User',
        region: data.region || null,
        language: data.language || null,
        topics: data.topics.length > 0 ? data.topics : null,
        purpose: data.purpose.length > 0 ? data.purpose : null,
        keywords: data.keywords.length > 0 ? data.keywords : null,
        is_public: data.isPublic,
      };

      console.log('Inserting document metadata:', documentData);
      const { error: insertError } = await supabase
        .from('documents')
        .insert(documentData);

      if (insertError) {
        console.error('Database Insert Error:', insertError);
        console.log(`Attempting to remove orphaned file: ${filePath}`);
        const { error: removeError } = await supabase.storage
          .from('media')
          .remove([filePath]);
        if (removeError) {
          console.error('Failed to remove orphaned file:', removeError);
        }
        throw new Error(`Database Error: ${insertError.message}`);
      }

      console.log('Document metadata inserted successfully.');
      setUploadProgress(100);
      // Success handling (e.g., navigation) should ideally be managed by the component calling the hook
      // But can provide feedback here
      alert('Upload successful!');
      router.push('/dashboard/admin'); // Or redirect as needed
      router.refresh();
    } catch (err: unknown) {
      console.error('Upload process failed:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'An unknown error occurred during upload.';
      setError(message);
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return { uploadDocument, loading, error, uploadProgress };
}
