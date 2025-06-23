import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { Document, DocumentCategory } from '@/types/document';
import { convertToDocuments } from '@/lib/utils/document-utils';

interface FilterState {
  category: DocumentCategory | '';
  region: string;
  language: string;
  author: string;
  keywords: string;
  topics: string[];
  purpose: string[];
}

export function useDocuments(filters: FilterState, authLoading: boolean) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<
    Record<DocumentCategory, number>
  >({} as Record<DocumentCategory, number>);

  // Fetch documents based on filters
  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    const fetchDocuments = async () => {
      console.log('useDocuments: Fetching documents...');
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient<Database>();
        let query = supabase.from('documents').select(`
            id,
            title,
            description,
            content_url,
            file_type,
            file_size,
            category,
            author_id,
            author_name,
            created_at,
            updated_at,
            region,
            language,
            topics,
            purpose,
            keywords
          `);

        // Apply filters
        if (filters.category) query = query.eq('category', filters.category);
        if (filters.region) query = query.eq('region', filters.region);
        if (filters.language) query = query.eq('language', filters.language);
        if (filters.author)
          query = query.ilike('author_name', `%${filters.author}%`);
        if (filters.keywords)
          query = query.or(
            `title.ilike.%${filters.keywords}%,description.ilike.%${filters.keywords}%`,
          );
        if (filters.topics.length > 0)
          query = query.overlaps('topics', filters.topics);
        if (filters.purpose.length > 0)
          query = query.overlaps('purpose', filters.purpose);

        console.log('useDocuments: Executing Supabase query...');
        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error('useDocuments: Fetch error:', fetchError);
          setError(`Failed to fetch documents: ${fetchError.message}`);
          setDocuments([]);
        } else {
          console.log(
            'useDocuments: Documents fetched successfully:',
            data?.length || 0,
          );
          if (!data || !Array.isArray(data)) {
            console.error('useDocuments: Invalid data returned:', data);
            setError('Invalid data format returned from the server');
            setDocuments([]);
          } else {
            setDocuments(convertToDocuments(data));
          }
        }
      } catch (err: unknown) {
        console.error('useDocuments: Unexpected error:', err);
        setError(
          `Unexpected error: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
        setDocuments([]);
      } finally {
        setLoading(false);
        console.log('useDocuments: fetchDocuments finished. Loading:', false);
      }
    };

    void fetchDocuments();
  }, [filters, authLoading]);

  // Fetch category counts
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      const supabase = createClient<Database>();
      const { data, error: rpcError } = await supabase.rpc(
        'get_category_counts',
      );

      if (rpcError) {
        console.error(
          'useDocuments: Error fetching category counts via RPC:',
          rpcError,
        );
        setCategoryCounts({} as Record<DocumentCategory, number>);
      } else {
        const counts =
          data?.reduce(
            (
              acc: Record<DocumentCategory, number>,
              item: { category: DocumentCategory; count: number | bigint },
            ) => {
              acc[item.category] = Number(item.count);
              return acc;
            },
            {} as Record<DocumentCategory, number>,
          ) || ({} as Record<DocumentCategory, number>);
        console.log('useDocuments: Category counts fetched:', counts);
        setCategoryCounts(counts);
      }
    };
    void fetchCategoryCounts();
  }, []);

  return { documents, setDocuments, loading, error, setError, categoryCounts };
}
