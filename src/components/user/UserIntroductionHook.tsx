'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

interface UserIntroduction {
  id: string;
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  left_column_image_url: string | null;
  right_column_image_url: string | null;
  left_column_image_position: 'above' | 'below' | null;
  right_column_image_position: 'above' | 'below' | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function useUserIntroduction(authLoading: boolean) {
  const [introContent, setIntroContent] = useState<UserIntroduction | null>(null);
  const [introModalOpen, setIntroModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIntroductionContent() {
      if (authLoading) return; // Skip if auth is still loading

      try {
        setLoading(true);
        // Use the consistent browser client creator
        const supabase = createClient<Database>();

        // Fetch active introduction content including image fields
        const { data, error } = await supabase
          .from('user_introduction')
          .select(`
            *,
            left_column_image_url,
            right_column_image_url,
            left_column_image_position,
            right_column_image_position
          `)
          .eq('active', true)
          .single();

        if (error) {
          console.error('Error fetching introduction content:', error);
          return;
        }

        if (data) {
          // Type cast the position fields to ensure they match our interface
          const typedData: UserIntroduction = {
            ...data,
            left_column_image_position: data.left_column_image_position as 'above' | 'below' | null,
            right_column_image_position: data.right_column_image_position as 'above' | 'below' | null,
          };
          setIntroContent(typedData);
          setIntroModalOpen(true);
        }
      } catch (error) {
        console.error('Error in introduction hook:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchIntroductionContent();
  }, [authLoading]);

  const handleCloseIntroModal = () => {
    setIntroModalOpen(false);
  };

  return {
    introContent,
    introModalOpen,
    handleCloseIntroModal,
    loading
  };
}