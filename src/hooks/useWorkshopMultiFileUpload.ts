'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { FileWithTitle } from '@/components/admin/workshops/MultiFileDropzone';

// Define the structure for workshop insertion from the DB types
type WorkshopInsert = Database['public']['Tables']['workshops']['Insert'];
type WorkshopFileInsert =
  Database['public']['Tables']['workshop_files']['Insert'];

interface UploadMultiFileWorkshopData {
  workshopTitle: string;
  files: FileWithTitle[];
  description?: string;
  region?: string;
  language?: string;
  topics?: string[];
  keywords?: string[];
}

interface UploadProgress {
  currentFile: number;
  totalFiles: number;
  fileName: string;
  fileProgress: number;
}

interface UseWorkshopMultiFileUploadResult {
  uploadWorkshopFiles: (data: UploadMultiFileWorkshopData) => Promise<void>;
  loading: boolean;
  error: string | null;
  uploadProgress: UploadProgress | null;
}

export function useWorkshopMultiFileUpload(): UseWorkshopMultiFileUploadResult {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null,
  );

  const uploadWorkshopFiles = async (
    data: UploadMultiFileWorkshopData,
  ): Promise<void> => {
    if (!user || !profile) {
      setError('User profile not available.');
      return;
    }

    if (!data.files || data.files.length === 0) {
      setError('No files selected for upload.');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(null);
    const supabase = createClient<Database>();

    const successfulUploads: string[] = [];
    const failedUploads: string[] = [];

    try {
      // Sanitize workshop folder name
      const sanitizedWorkshopTitle = data.workshopTitle
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_-]/g, '');

      console.log(`Creating workshop with ${data.files.length} files...`);

      // Create the main workshop entry first
      const workshopData: WorkshopInsert = {
        title: data.workshopTitle,
        description: data.description || null,
        folder_path: sanitizedWorkshopTitle,
        created_by: user.id,
        created_by_name:
          (profile.name as string) || user.email || 'Unknown User',
        region: data.region || null,
        language: data.language || null,
        topics: data.topics && data.topics.length > 0 ? data.topics : null,
        keywords:
          data.keywords && data.keywords.length > 0 ? data.keywords : null,
      };

      const { data: workshop, error: insertError } = await supabase
        .from('workshops')
        .insert([workshopData])
        .select()
        .single();

      if (insertError) {
        throw new Error(
          `Database Error: ${
            insertError?.message || 'Failed to create workshop'
          }`,
        );
      }

      console.log('Workshop created successfully:', workshop);

      // Upload each file and create workshop_files entries
      for (let i = 0; i < data.files.length; i++) {
        const fileWithTitle = data.files[i];

        setUploadProgress({
          currentFile: i + 1,
          totalFiles: data.files.length,
          fileName: fileWithTitle.title,
          fileProgress: 0,
        });

        try {
          setUploadProgress((prev) =>
            prev ? { ...prev, fileProgress: 25 } : null,
          );

          // Prepare metadata for the file
          const fileExtension = fileWithTitle.file.name.split('.').pop() || '';
          const timestamp = Date.now();
          const userIdentifier = user.id.slice(0, 8);
          const sanitizedFileTitle = fileWithTitle.title
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_-]/g, '');

          const metadata = {
            title: sanitizedFileTitle,
            region: data.region || 'no-region',
            language: data.language || 'no-language',
            created_by: userIdentifier,
            created_by_name: (profile.name || user.email || 'unknown').replace(
              /[^a-zA-Z0-9]/g,
              '_',
            ),
          };

          const metadataString = Object.values(metadata).join('_');
          const fileName = `${sanitizedFileTitle}_${metadataString}_${timestamp}.${fileExtension}`;

          // Upload the file in the workshop folder
          const filePath = `${sanitizedWorkshopTitle}/${fileName}`
            .replace(/\/+/g, '/')
            .replace(/^\/|\/$/g, '');

          setUploadProgress((prev) =>
            prev ? { ...prev, fileProgress: 50 } : null,
          );

          // Upload file to storage
          const { error: uploadError } = await supabase.storage
            .from('workshops')
            .upload(filePath, fileWithTitle.file, {
              upsert: false,
              contentType:
                fileWithTitle.file.type || 'application/octet-stream',
            });

          if (uploadError) {
            throw new Error(`Storage Error: ${uploadError.message}`);
          }

          setUploadProgress((prev) =>
            prev ? { ...prev, fileProgress: 75 } : null,
          );

          // Get signed URL for the uploaded file
          const { data: signedUrlData, error: urlError } =
            await supabase.storage
              .from('workshops')
              .createSignedUrl(filePath, 3600); // 1 hour expiry

          if (urlError || !signedUrlData) {
            throw new Error(
              `Storage Error: ${urlError?.message || 'Failed to get file URL'}`,
            );
          }

          // Create workshop_files entry
          const fileData: WorkshopFileInsert = {
            workshop_id: workshop.id,
            title: fileWithTitle.title,
            description: data.description || null,
            file_path: filePath,
            file_type: fileWithTitle.file.type,
            file_size: fileWithTitle.file.size,
            file_url: signedUrlData.signedUrl,
            region: data.region || null,
            language: data.language || null,
            author: (profile.name as string) || user.email || null,
            topics: data.topics && data.topics.length > 0 ? data.topics : null,
            keywords:
              data.keywords && data.keywords.length > 0 ? data.keywords : null,
          };

          const { error: fileInsertError } = await supabase
            .from('workshop_files')
            .insert([fileData]);

          if (fileInsertError) {
            throw new Error(
              `Database Error: ${
                fileInsertError?.message || 'Failed to create workshop file'
              }`,
            );
          }

          console.log(`File uploaded successfully: ${fileWithTitle.title}`);

          setUploadProgress((prev) =>
            prev ? { ...prev, fileProgress: 100 } : null,
          );
          successfulUploads.push(fileWithTitle.title);
        } catch (fileErr) {
          console.error(
            `Error uploading file ${fileWithTitle.title}:`,
            fileErr,
          );
          failedUploads.push(fileWithTitle.title);
        }
      }

      // If no files were uploaded successfully, delete the workshop and show error
      if (successfulUploads.length === 0) {
        await supabase.from('workshops').delete().eq('id', workshop.id);
        toast.error(
          'Failed to upload any files. The workshop was not created.',
        );
        return;
      }

      // Show summary message
      if (successfulUploads.length === data.files.length) {
        toast.success(
          `Successfully created workshop "${data.workshopTitle}" with ${successfulUploads.length} files!`,
        );
      } else if (successfulUploads.length > 0) {
        toast.success(
          `Successfully created workshop "${data.workshopTitle}" with ${successfulUploads.length} of ${data.files.length} files.`,
        );
        if (failedUploads.length > 0) {
          toast.error(`Failed to upload: ${failedUploads.join(', ')}`);
        }
      }

      // Redirect to the appropriate workshops page based on user role
      setTimeout(() => {
        const dashboardPath =
          profile.role === 'admin'
            ? '/dashboard/admin/workshops'
            : '/dashboard/editor/workshops';
        router.push(
          `${process.env.NEXT_PUBLIC_SITE_URL || ''}${dashboardPath}`,
        );
        router.refresh();
      }, 1500);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unknown error occurred during upload.';
      setError(message);
      setUploadProgress(null);
    } finally {
      setLoading(false);
    }
  };

  return { uploadWorkshopFiles, loading, error, uploadProgress };
}
