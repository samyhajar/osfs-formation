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
  left_column_gallery_urls: string[];
  right_column_gallery_urls: string[];
  left_column_gallery_titles: string[];
  right_column_gallery_titles: string[];
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

                // Check if user has already seen the introduction modal recently (with 1-hour expiry)
        const hasSeenIntroKey = 'osfs_user_intro_seen_session';
        const timestampKey = 'osfs_user_intro_timestamp';
        const hasSeenIntro = sessionStorage.getItem(hasSeenIntroKey);
        const timestamp = sessionStorage.getItem(timestampKey);

        // Check if the flag exists and is still valid (less than 1 hour old)
        if (hasSeenIntro === 'true' && timestamp) {
          const oneHourInMs = 60 * 60 * 1000; // 1 hour in milliseconds
          const flagAge = Date.now() - parseInt(timestamp, 10);

          if (flagAge < oneHourInMs) {
            console.log(`User has seen introduction modal recently (${Math.round(flagAge / 1000 / 60)} minutes ago), skipping...`);
            setLoading(false);
            return;
          } else {
            console.log(`Introduction modal flag expired (${Math.round(flagAge / 1000 / 60)} minutes old), showing modal again`);
            // Clear expired flag
            sessionStorage.removeItem(hasSeenIntroKey);
            sessionStorage.removeItem(timestampKey);
          }
        }

        // Use the consistent browser client creator
        const supabase = createClient<Database>();

        // Fetch active introduction content including image and gallery fields
        const { data, error } = await supabase
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

        if (error) {
          console.error('Error fetching introduction content:', error);
          return;
        }

        if (data) {
          const typedData: UserIntroduction = {
            id: data.id,
            coordinator_name: data.coordinator_name,
            left_column_content: data.left_column_content,
            right_column_content: data.right_column_content,
            left_column_image_url: null,
            right_column_image_url: null,
            left_column_image_position: null,
            right_column_image_position: null,
            left_column_gallery_urls: data.left_column_gallery_urls || [],
            right_column_gallery_urls: data.right_column_gallery_urls || [],
            left_column_gallery_titles: data.left_column_gallery_titles || [],
            right_column_gallery_titles: data.right_column_gallery_titles || [],
            active: data.active,
            created_at: data.created_at,
            updated_at: data.updated_at,
          };
          setIntroContent(typedData);
          setIntroModalOpen(true);

          console.log('Showing user introduction modal for the first time this session');
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

    // Mark that user has seen the introduction modal with timestamp
    const hasSeenIntroKey = 'osfs_user_intro_seen_session';
    const timestampKey = 'osfs_user_intro_timestamp';
    const currentTime = Date.now().toString();

    sessionStorage.setItem(hasSeenIntroKey, 'true');
    sessionStorage.setItem(timestampKey, currentTime);

    console.log('User introduction modal closed, marked as seen with 1-hour expiry');
  };

  return {
    introContent,
    introModalOpen,
    handleCloseIntroModal,
    loading
  };
}