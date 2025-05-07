'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { WorkshopFilesList } from '@/components/admin/workshops/WorkshopFilesList';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { Workshop } from '@/types/workshop';

export default function WorkshopFolderPage() {
  const params = useParams();
  const workshopId = params?.workshop?.toString() || '';
  const folderPath = Array.isArray(params?.folder) ? params.folder.join('/') : '';
  const basePath = '/dashboard/formant/workshops';
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      if (!workshopId) {
        setError('Workshop ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const supabase = createClient<Database>();
        const { data, error: fetchError } = await supabase
          .from('workshops')
          .select('*')
          .eq('id', workshopId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error('Workshop not found');
        }

        if (!data.folder_path) {
          throw new Error('Workshop folder path not found');
        }

        setWorkshop(data);
      } catch (err) {
        console.error('Error fetching workshop:', err);
        setError(err instanceof Error ? err.message : 'Failed to load workshop');
      } finally {
        setLoading(false);
      }
    };

    void fetchWorkshop();
  }, [workshopId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !workshop || !workshop.folder_path) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error || 'Workshop not found'}
        </div>
      </div>
    );
  }

  // Use only the additional path segments beyond the workshop's base folder_path
  const effectiveFolderPath = folderPath.startsWith(workshop.folder_path)
    ? folderPath.slice(workshop.folder_path.length).replace(/^\/+/, '')
    : folderPath;

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 bg-gray-50">
        {/* Back link and Title */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href={`${basePath}/${workshopId}`}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to Workshop"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            {effectiveFolderPath || workshop.title}
          </h1>
        </div>

        {/* Files List */}
        <WorkshopFilesList
          workshopId={workshopId}
          folderPath={effectiveFolderPath}
          hideUpload={false} // Allow upload functionality for formant users
        />
      </main>
    </div>
  );
}