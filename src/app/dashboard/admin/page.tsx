'use client';

import { useState, useEffect } from 'react';
// Remove the auth-helpers import
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import DocumentsFilters from '@/components/dashboard/admin/DocumentsFilters';
import DocumentList from '@/components/dashboard/admin/DocumentList';
import { Database } from '@/types/supabase';
import { Document, DocumentCategory } from '@/types/document';
import { useAuth } from '@/contexts/AuthContext';
// Import our consistent browser client creator
import { createClient } from '@/lib/supabase/browser-client';

export default function DashboardPage() {
  // Use authLoading from context
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<DocumentCategory, number>>({} as Record<DocumentCategory, number>);
  const [filters, setFilters] = useState({
    category: '',
    region: '',
    language: '',
    author: '',
    keywords: '',
    topics: [] as string[],
    purpose: [] as string[]
  });

  useEffect(() => {
    // Check auth loading state from context
    if (authLoading) {
      // Keep showing loading spinner if auth is loading
      setLoading(true);
      return;
    }

    const fetchDocuments = async () => {
      console.log("DashboardPage: Fetching documents...");
      try {
        setLoading(true);
        setError(null);

        // Use the consistent browser client
        const supabase = createClient<Database>();

        // Use explicit column selection (copied from previous successful edit)
        let query = supabase
          .from('documents')
          .select(`
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
            keywords,
            is_public
          `)
          .order('created_at', { ascending: false });

        // Apply filters (copied from previous successful edit)
        if (filters.category) {
          query = query.eq('category', filters.category as DocumentCategory);
        }
        if (filters.region) {
          query = query.eq('region', filters.region);
        }
        if (filters.language) {
          query = query.eq('language', filters.language);
        }
        if (filters.author) {
          query = query.ilike('author_name', `%${filters.author}%`);
        }
        if (filters.keywords) {
          query = query.or(`title.ilike.%${filters.keywords}%,description.ilike.%${filters.keywords}%`);
        }
        if (filters.topics.length > 0) {
          query = query.overlaps('topics', filters.topics);
        }
        if (filters.purpose.length > 0) {
          query = query.overlaps('purpose', filters.purpose);
        }

        console.log("DashboardPage: Executing Supabase query...");
        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error("DashboardPage: Fetch error:", fetchError);
          setError(`Failed to fetch documents: ${fetchError.message}`);
          setDocuments([]);
        } else {
          console.log("DashboardPage: Documents fetched successfully:", data?.length || 0);
          if (!data || !Array.isArray(data)) {
            console.error("DashboardPage: Invalid data returned:", data);
            setError("Invalid data format returned from the server");
            setDocuments([]);
          } else {
            setDocuments(data as Document[]);
          }
        }
      } catch (err: any) {
        console.error("DashboardPage: Unexpected error:", err);
        setError(`Unexpected error: ${err.message}`);
        setDocuments([]);
      } finally {
        setLoading(false);
        console.log("DashboardPage: fetchDocuments finished. Loading:", false);
      }
    };

    // Fetch documents regardless of user state, RLS handles permissions
      fetchDocuments();

  // Depend on filters and authLoading state
  }, [filters, authLoading]);

  // Effect to fetch category counts via RPC
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      const supabase = createClient<Database>();
      // Call the RPC function
      const { data, error: rpcError } = await supabase.rpc('get_category_counts');

      if (rpcError) {
        console.error("DashboardPage: Error fetching category counts via RPC:", rpcError);
        setCategoryCounts({} as Record<DocumentCategory, number>); // Fixed state setter
      } else {
        // Type the parameters in reduce
        const counts = data?.reduce((acc: Record<DocumentCategory, number>, item: { category: DocumentCategory; count: number | bigint }) => {
          acc[item.category] = Number(item.count); // Ensure count is number
          return acc;
        }, {} as Record<DocumentCategory, number>) || {} as Record<DocumentCategory, number>;
        console.log("DashboardPage: Category counts fetched:", counts);
        setCategoryCounts(counts);
      }
    };

    fetchCategoryCounts();
  }, []); // Run once on mount

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const handleDeleteDocument = async (id: string) => {
    // Document deletion logic will go here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-black">Documents</h1>
           <p className="text-gray-500 mt-1">Browse and manage all documents.</p>
        </div>
        <Link
          href="/dashboard/admin/documents/new"
          className="flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white font-medium py-2 px-4 rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Upload Document
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <DocumentsFilters filters={filters} onFilterChange={handleFilterChange} categoryCounts={categoryCounts} />

      <DocumentList
        documents={documents}
        // Use the local loading state which depends on authLoading
        isLoading={loading}
        onDelete={handleDeleteDocument}
      />
    </div>
  );
}