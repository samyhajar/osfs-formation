import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';

export function useSignedImageUrl(imageUrl: string | null) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setSignedUrl(null);
      return;
    }

    if (imageUrl.includes('token=')) {
      setSignedUrl(imageUrl);
      return;
    }

    async function generateSignedUrl() {
      if (!imageUrl) return;

      setLoading(true);
      try {
        const supabase = createClient<Database>();
        let filePath = imageUrl;
        if (imageUrl.includes('/storage/v1/object/')) {
          const parts = imageUrl.split('/storage/v1/object/public/images/');
          if (parts.length > 1) {
            filePath = parts[1];
          }
        }

        const { data, error } = await supabase.storage
          .from('images')
          .createSignedUrl(filePath, 3600);

        if (error) {
          console.error('Error creating signed URL:', error);
          setSignedUrl(null);
        } else {
          setSignedUrl(data.signedUrl);
        }
      } catch (error) {
        console.error('Error generating signed URL:', error);
        setSignedUrl(null);
      } finally {
        setLoading(false);
      }
    }

    void generateSignedUrl();
  }, [imageUrl]);

  return { signedUrl, loading };
}