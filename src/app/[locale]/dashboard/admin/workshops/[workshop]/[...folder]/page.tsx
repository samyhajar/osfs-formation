'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { WorkshopFilesList } from '@/components/admin/workshops/WorkshopFilesList';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

type Workshop = Database['public']['Tables']['workshops']['Row'];

export default function WorkshopFolderPage() {
  const params = useParams();
  const workshopId = params?.workshop as string;
  const folderPath = Array.isArray(params?.folder) ? params.folder.join('/') : '';
  const basePath = '/dashboard/admin/workshops';
  const [workshop, setWorkshop] = useState<Workshop | null>(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      const supabase = createClient<Database>();
      const { data } = await supabase
        .from('workshops')
        .select('*')
        .eq('id', workshopId)
        .single();

      if (data) {
        setWorkshop(data);
      }
    };

    void fetchWorkshop();
  }, [workshopId]);

  // Use only the additional path segments beyond the workshop's base folder_path
  const effectiveFolderPath = workshop?.folder_path && folderPath.startsWith(workshop.folder_path)
    ? folderPath.slice(workshop.folder_path.length).replace(/^\/+/, '')
    : '';

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 bg-gray-50">
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
            {workshop?.title || 'Workshop Files'}
          </h1>
        </div>

        {/* Files List */}
        <WorkshopFilesList
          workshopId={workshopId}
          folderPath={effectiveFolderPath}
        />
      </main>
    </div>
  );
}