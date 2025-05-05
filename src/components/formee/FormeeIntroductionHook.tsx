'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

export interface FormeeIntroduction {
  id: string;
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Custom hook to fetch and manage formee introduction content and modal state
 */
export function useFormeeIntroduction(authLoading: boolean) {
  const [introModalOpen, setIntroModalOpen] = useState(false);
  const [introContent, setIntroContent] = useState<FormeeIntroduction | null>(null);
  const [_loadingIntro, setLoadingIntro] = useState(true);

  useEffect(() => {
    const fetchIntroContent = async () => {
      try {
        setLoadingIntro(true);

        const supabase = createClient<Database>();

        // Fetch the active introduction content
        const { data, error: fetchError } = await supabase
          .from('formee_introduction' as keyof Database['public']['Tables'])
          .select('*')
          .eq('active', true)
          .single();

        if (fetchError) {
          console.error('Error fetching introduction content:', fetchError);
          setLoadingIntro(false);
          return;
        }

        if (data) {
          console.log('Introduction content loaded');
          setIntroContent(data as unknown as FormeeIntroduction);
          setIntroModalOpen(true);
        }
      } catch (err) {
        console.error('Error in fetchIntroContent:', err);
      } finally {
        setLoadingIntro(false);
      }
    };

    if (!authLoading) {
      void fetchIntroContent();
    }
  }, [authLoading]);

  return {
    introContent,
    introModalOpen,
    handleCloseIntroModal: () => setIntroModalOpen(false)
  };
}