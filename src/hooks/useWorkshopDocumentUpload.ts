'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

// Define the structure for workshop insertion from the DB types
// (title is the folder name, folder_path is the storage path)
type WorkshopInsert = Database['public']['Tables']['workshops']['Insert'];

interface UploadWorkshopData {
  title: string;
  description?: string;
  file: File;
  region?: string;
  language?: string;
  topics?: string[];
  keywords?: string[];
  isPublic?: boolean;
}

interface UseWorkshopDocumentUploadResult {
  uploadWorkshopDocument: (data: UploadWorkshopData) => Promise<void>;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

export function useWorkshopDocumentUpload(): UseWorkshopDocumentUploadResult {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadWorkshopDocument = async (
    data: UploadWorkshopData,
  ): Promise<void> => {
    if (!user || !profile) {
      setError('User profile not available.');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);
    const supabase = createClient<Database>();

    // Sanitize folder name for use in path
    const sanitizedTitle = data.title
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_-]/g, '');

    try {
      // First create the workshop entry
      const workshopData: WorkshopInsert = {
        title: data.title,
        description: data.description || null,
        folder_path: sanitizedTitle,
        created_by: user.id,
        created_by_name:
          (profile.name as string) || user.email || 'Unknown User',
        region: data.region || null,
        language: data.language || null,
        topics: data.topics && data.topics.length > 0 ? data.topics : null,
        keywords:
          data.keywords && data.keywords.length > 0 ? data.keywords : null,
        is_public: data.isPublic ?? true,
      };

      const { data: workshop, error: insertError } = await supabase
        .from('workshops')
        .insert([workshopData])
        .select()
        .single();

      if (insertError || !workshop) {
        throw new Error(
          `Database Error: ${
            insertError?.message || 'Failed to create workshop'
          }`,
        );
      }

      setUploadProgress(25);

      // Prepare metadata for the initial file
      const fileExtension = data.file.name.split('.').pop() || '';
      const timestamp = Date.now();
      const userIdentifier = user.id.slice(0, 8);
      const metadata = {
        title: data.title,
        region: data.region || 'no-region',
        language: data.language || 'no-language',
        created_by: userIdentifier,
        created_by_name: (profile.name || user.email || 'unknown').replace(
          /[^a-zA-Z0-9]/g,
          '_',
        ),
      };

      const metadataString = Object.values(metadata).join('_');
      const fileName = `${sanitizedTitle}_${metadataString}_${timestamp}.${fileExtension}`;

      // Upload the initial file directly in the workshop folder
      const filePath = `${sanitizedTitle}/${fileName}`
        .replace(/\/+/g, '/')
        .replace(/^\/|\/$/g, '');

      setUploadProgress(50);

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('workshops')
        .upload(filePath, data.file, {
          upsert: false,
          contentType: data.file.type || 'application/octet-stream',
        });

      if (uploadError) {
        // Delete the workshop if file upload fails
        await supabase.from('workshops').delete().eq('id', workshop.id);
        throw new Error(`Storage Error: ${uploadError.message}`);
      }

      setUploadProgress(75);

      // Get signed URL for the uploaded file
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('workshops')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (urlError || !signedUrlData) {
        throw new Error(
          `Storage Error: ${urlError?.message || 'Failed to get file URL'}`,
        );
      }

      // Update workshop with file information
      const { error: updateError } = await supabase
        .from('workshops')
        .update({
          file_path: filePath,
          file_url: signedUrlData.signedUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', workshop.id);

      if (updateError) {
        throw new Error(`Database Error: ${updateError.message}`);
      }

      setUploadProgress(100);
      toast.success(`Successfully created workshop: ${data.title}`);

      // Redirect to workshops page after a short delay
      setTimeout(() => {
        router.push('/en/dashboard/admin/workshops');
        router.refresh();
      }, 1500);
    } catch (err) {
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

  return { uploadWorkshopDocument, loading, error, uploadProgress };
}
