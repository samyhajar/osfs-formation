'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { FolderComponent } from '@/components/shared/FolderComponent';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

export default function WorkshopsPage() {
  const basePath = '/dashboard/user/workshops';
  const t = useTranslations('WorkshopsPage');
  const [workshops, setWorkshops] = useState<Database['public']['Tables']['workshops']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshops = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient<Database>();
        const { data, error: fetchError } = await supabase
          .from('workshops')
          .select('*');
        if (fetchError) throw fetchError;
        setWorkshops(data || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load workshops');
      } finally {
        setLoading(false);
      }
    };
    void fetchWorkshops();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{t('title')}</h1>
        </div>
        {/* Workshop Folders Grid */}
        {loading ? (
          <div className="text-gray-500">{t('loading')}</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : workshops.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            {t('noWorkshops')}
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">{t('workshopsTitle')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {workshops.map((workshop) => (
                <FolderComponent
                  key={workshop.id}
                  basePath={`${basePath}/${workshop.id}`}
                  categoryName={workshop.folder_path || ''}
                  categoryTranslationNamespace="WorkshopsPage.workshops"
                  title={workshop.title}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}