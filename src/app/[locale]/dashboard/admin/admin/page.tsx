'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserIntroductionForm } from './components/UserIntroductionForm';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

// Define the UserIntroduction type
interface UserIntroduction {
  id: string;
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AdminPage() {
  const t = useTranslations('Administration');
  const [introContent, setIntroContent] = useState<UserIntroduction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserIntroduction() {
      try {
        setLoading(true);
        const supabase = createClient<Database>();

        // Use proper type assertion for tables not yet in the generated types
        const { data, error: fetchError } = await supabase
          .from('user_introduction' as keyof Database['public']['Tables'])
          .select('*')
          .eq('active', true)
          .single();

        if (fetchError) {
          console.error('Error fetching user introduction:', fetchError);
          setError(fetchError.message);
        } else {
          setIntroContent(data as unknown as UserIntroduction);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    // Use void operator to properly handle Promise
    void fetchUserIntroduction();
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