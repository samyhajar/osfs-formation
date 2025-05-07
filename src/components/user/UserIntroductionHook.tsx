'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

interface UserIntroduction {
  id: string;
  coordinator_name: string;
  left_column_content: string;
  right_column_content: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function useUserIntroduction(authLoading: boolean) {
  const [introContent, setIntroContent] = useState<UserIntroduction | null>(null);
  const [introModalOpen, setIntroModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function fetchIntroductionContent() {
      if (authLoading) return; // Skip if auth is still loading

      try {
        // Fetch active introduction content
        const { data, error } = await supabase
          .from('user_introduction')
          .select('*')
          .eq('active', true)
          .single();

        if (error) {
          console.error('Error fetching introduction content:', error);
          setLoading(false);
          return;
        }

        if (data) {
          setIntroContent(data);
          setIntroModalOpen(true);
        }
      } catch (error) {
        console.error('Error in introduction hook:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchIntroductionContent();
  }, [supabase, authLoading]);

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