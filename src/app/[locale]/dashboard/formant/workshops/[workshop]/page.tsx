'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { WorkshopFilesList } from '@/components/admin/workshops/WorkshopFilesList';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { Workshop } from '@/types/workshop';

export default function WorkshopPage() {
  const params = useParams();
  const workshopId = params?.workshop?.toString() || '';
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-6">
        {/* Back link and Title */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href={basePath}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to Workshops"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            {workshop.title}
          </h1>
        </div>

        {/* Workshop Description */}
        {workshop.description && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-gray-600">{workshop.description}</p>
          </div>
        )}

        {/* Workshop Files */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Workshop Files</h2>
          <div className="bg-white rounded-lg shadow-md border border-gray-100 p-4">
            <WorkshopFilesList
              workshopId={workshopId}
              folderPath={workshop.folder_path}
              hideUpload={false} // Allow formants to upload files
            />
          </div>
        </div>
      </main>
    </div>
  );
}