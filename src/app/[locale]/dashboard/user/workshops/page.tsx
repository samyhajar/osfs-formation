'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { WorkshopFolderComponent } from '@/components/shared/WorkshopFolderComponent';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function WorkshopsPage() {
  const basePath = '/dashboard/user/workshops';
  const t = useTranslations('AdminWorkshopsPage');
  const { user, profile } = useAuth();
  const [workshops, setWorkshops] = useState<Database['public']['Tables']['workshops']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndValidateWorkshops = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const supabase = createClient<Database>();

        // Fetch all workshops from database
        const { data: dbWorkshops, error: fetchError } = await supabase
          .from('workshops')
          .select('*');

        if (fetchError) throw fetchError;

        if (!dbWorkshops || dbWorkshops.length === 0) {
          setWorkshops([]);
          return;
        }

        // Temporarily show all workshops for debugging
        console.log('User workshops: All workshops from DB:', dbWorkshops);
        setWorkshops(dbWorkshops);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load workshops');
      } finally {
        setLoading(false);
      }
    };

    void fetchAndValidateWorkshops();
  }, [user]);

  const userRole = profile?.role || 'user';

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{t('title')}</h1>
          {/* No upload button for users */}
        </div>

        {/* Workshop Folders Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            {t('noWorkshops')}
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">{t('workshopsTitle')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {workshops.map((workshop) => (
                <WorkshopFolderComponent
                  key={workshop.id}
                  basePath={basePath}
                  workshopId={workshop.id}
                  title={workshop.title}
                  userRole={userRole}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}