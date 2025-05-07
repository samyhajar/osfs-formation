'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { Document, DocumentCategory } from '@/types/document';
import { FileObject } from '@supabase/storage-js';

interface FileMetadata {
  size: number;
}

interface UseWorkshopFilesResult {
  files: Document[];
  loading: boolean;
  error: string | null;
  fetchFiles: () => Promise<void>;
}

export function useWorkshopFiles(
  workshopId: string,
  folderPath: string,
): UseWorkshopFilesResult {
  const [files, setFiles] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient<Database>();

      // Debug logs for path
      console.log('Workshop ID:', workshopId);
      console.log('Input folder path:', folderPath);

      // First, get the workshop to check its folder_path
      const { data: workshop, error: workshopError } = await supabase
        .from('workshops')
        .select('*')
        .eq('id', workshopId)
        .single();

      if (workshopError) {
        console.error('Error fetching workshop:', workshopError);
        throw workshopError;
      }

      console.log('Workshop data:', workshop);

      // Use the workshop's folder_path if available
      const storagePath = workshop?.folder_path || folderPath || '';
      console.log('Final storage path to search:', storagePath);

      // List files in the workshop folder
      const { data: storageFiles, error: storageError } = await supabase.storage
        .from('workshops')
        .list(storagePath, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (storageError) {
        console.error('Storage error:', storageError);
        throw storageError;
      }

      console.log('Found files:', storageFiles);

      // Get signed URLs for each file
      const filesWithUrls = await Promise.all(
        (storageFiles || []).map(async (file: FileObject) => {
          if (!file.name) return null; // Skip if no file name
          console.log('Processing file:', file);

          // Use the full storage path for the file
          const filePath = `${storagePath}/${file.name}`;
          console.log('File path:', filePath);

          // Get signed URL
          const { data: urlData, error: urlError } = await supabase.storage
            .from('workshops')
            .createSignedUrl(filePath, 3600);

          if (urlError) {
            console.error('URL error for file', file.name, ':', urlError);
            return null; // Skip this file if we can't get a URL
          }

          // Parse metadata from filename
          const fileNameParts = file.name.split('_');
          const extension = fileNameParts.pop()?.split('.').pop() || '';
          const metadata = {
            title: fileNameParts[0] || file.name,
            region: fileNameParts[1] || 'no-region',
            language: fileNameParts[2] || 'no-language',
            created_by: fileNameParts[3] || 'unknown',
            created_by_name: fileNameParts[4] || 'Unknown User',
          };

          const document: Document = {
            id: file.id || filePath,
            title: metadata.title,
            description: '',
            file_name: file.name,
            file_path: filePath,
            file_url: urlData?.signedUrl || '',
            file_type: extension,
            file_size: (file.metadata as FileMetadata)?.size || 0,
            created_at: file.created_at || new Date().toISOString(),
            updated_at: file.updated_at || new Date().toISOString(),
            created_by: metadata.created_by,
            created_by_name: metadata.created_by_name,
            category: 'Miscellaneous' as DocumentCategory,
            region: metadata.region,
            language: metadata.language,
          };

          return document;
        }),
      );

      // Filter out any null values from files that couldn't be processed
      const validFiles = filesWithUrls.filter(
        (file): file is Document => file !== null,
      );
      console.log('Processed files:', validFiles);
      setFiles(validFiles);
    } catch (err: unknown) {
      console.error('Error in useWorkshopFiles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch files');
    } finally {
      setLoading(false);
    }
  }, [workshopId, folderPath]);

  useEffect(() => {
    void fetchFiles();
  }, [fetchFiles]);

  return { files, loading, error, fetchFiles };
}
