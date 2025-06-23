import { useState, useEffect } from 'react';
import { getHomepageContentWithFallback } from '@/services/homepage';
import type { HomepageContent } from '@/types/homepage';

export function useHomepageContent() {
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getHomepageContentWithFallback();
        setContent(data);
      } catch (err) {
        console.error('Error fetching homepage content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    void fetchContent();
  }, []);

  return { content, loading, error };
}
