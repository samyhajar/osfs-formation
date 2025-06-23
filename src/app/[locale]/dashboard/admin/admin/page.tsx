'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserIntroductionForm } from './components/UserIntroductionForm';
import { HomepageSettingsForm } from './components/HomepageSettingsForm';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { HomepageContent } from '@/types/homepage';

// Define the UserIntroduction type
interface UserIntroduction {
  id: string;
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  left_column_gallery_urls: string[];
  right_column_gallery_urls: string[];
  left_column_gallery_titles: string[];
  right_column_gallery_titles: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const t = useTranslations('Administration');
  const [introContent, setIntroContent] = useState<UserIntroduction | null>(null);
  const [homepageContent, setHomepageContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const supabase = createClient<Database>();

                // Fetch user introduction
        const { data: introData, error: introError } = await supabase
          .from('user_introduction')
          .select(`
            id,
            coordinator_name,
            left_column_content,
            right_column_content,
            left_column_gallery_urls,
            right_column_gallery_urls,
            left_column_gallery_titles,
            right_column_gallery_titles,
            active,
            created_at,
            updated_at
          `)
          .eq('active', true)
          .single();

        if (introError) {
          console.error('Error fetching user introduction:', introError);

          // If .single() fails, try to get the first record regardless of active status
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('user_introduction')
            .select(`
              id,
              coordinator_name,
              left_column_content,
              right_column_content,
              left_column_gallery_urls,
              right_column_gallery_urls,
              left_column_gallery_titles,
              right_column_gallery_titles,
              active,
              created_at,
              updated_at
            `)
            .limit(1);

          if (!fallbackError && fallbackData && fallbackData.length > 0) {
            setIntroContent(fallbackData[0] as unknown as UserIntroduction);
          } else {
            setError(`Failed to fetch user introduction: ${introError.message}`);
          }
        } else {
          setIntroContent(introData as unknown as UserIntroduction);
        }

        // Fetch homepage content
        const { data: homepageData, error: homepageError } = await supabase
          .from('homepage_content')
          .select('*')
          .eq('active', true)
          .single();

        if (homepageError) {
          console.error('Error fetching homepage content:', homepageError);
        } else {
          setHomepageContent(homepageData as HomepageContent);
        }

      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    // Use void operator to properly handle Promise
    void fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('title', { fallback: 'Administration' })}</h1>
        <p className="text-gray-500 mt-1">
          {t('description', { fallback: 'Manage system settings and configuration.' })}
        </p>
      </div>

      <Tabs defaultValue="user-introduction" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="user-introduction">
            {t('userIntroductionTab', { fallback: 'User Introduction' })}
          </TabsTrigger>
          <TabsTrigger value="homepage-settings">
            {t('homepageSettingsTab', { fallback: 'Homepage Settings' })}
          </TabsTrigger>
          <TabsTrigger value="settings">
            {t('settingsTab', { fallback: 'Settings' })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="user-introduction">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('userIntroductionTitle', { fallback: 'User Introduction Page' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                  {error}
                </div>
              ) : (
                <UserIntroductionForm initialData={introContent} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homepage-settings">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('homepageSettingsTitle', { fallback: 'Homepage Settings' })}
              </CardTitle>
              <p className="text-gray-500 mt-1">
                {t('homepageSettingsDescription', { fallback: 'Customize the public homepage that visitors see before logging in.' })}
              </p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                  {error}
                </div>
              ) : (
                <HomepageSettingsForm initialData={homepageContent} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('systemSettingsTitle', { fallback: 'System Settings' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                {t('systemSettingsDescription', { fallback: 'Additional system settings will be available here in the future.' })}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}