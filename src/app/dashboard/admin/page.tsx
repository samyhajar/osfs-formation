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
  // Remove unused 'user'
  const { loading: authLoading } = useAuth();
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
    if (authLoading) {
      setLoading(true);
      return;
    }

    // Wrap async logic in IIFE
    const fetchDocuments = async () => {
      console.log("DashboardPage: Fetching documents...");
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient<Database>();
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

        // Apply filters
        if (filters.category) query = query.eq('category', filters.category as DocumentCategory);
        if (filters.region) query = query.eq('region', filters.region);
        if (filters.language) query = query.eq('language', filters.language);
        if (filters.author) query = query.ilike('author_name', `%${filters.author}%`);
        if (filters.keywords) query = query.or(`title.ilike.%${filters.keywords}%,description.ilike.%${filters.keywords}%`);
        if (filters.topics.length > 0) query = query.overlaps('topics', filters.topics);
        if (filters.purpose.length > 0) query = query.overlaps('purpose', filters.purpose);

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
      } catch (err: unknown) { // Use unknown
        console.error("DashboardPage: Unexpected error:", err);
        // Type guard for Error object
        setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
        setDocuments([]);
      } finally {
        setLoading(false);
        console.log("DashboardPage: fetchDocuments finished. Loading:", false);
      }
    };

    void fetchDocuments(); // Call async function correctly

  }, [filters, authLoading]);

  useEffect(() => {
    // Wrap async logic in IIFE
    const fetchCategoryCounts = async () => {
      const supabase = createClient<Database>();
      const { data, error: rpcError } = await supabase.rpc('get_category_counts');

      if (rpcError) {
        console.error("DashboardPage: Error fetching category counts via RPC:", rpcError);
        setCategoryCounts({} as Record<DocumentCategory, number>);
      } else {
        const counts = data?.reduce((acc: Record<DocumentCategory, number>, item: { category: DocumentCategory; count: number | bigint }) => {
          acc[item.category] = Number(item.count);
          return acc;
        }, {} as Record<DocumentCategory, number>) || {} as Record<DocumentCategory, number>;
        console.log("DashboardPage: Category counts fetched:", counts);
        setCategoryCounts(counts);
      }
    };
    void fetchCategoryCounts(); // Call async function correctly
  }, []);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  // Prefix unused id with underscore, remove async as it does nothing yet
  const handleDeleteDocument = (_id: string) => {
    console.log('Delete action triggered for document:', _id);
    // Document deletion logic will go here
    // Needs proper implementation (e.g., call API, update state)
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
        isLoading={loading}
        onDelete={handleDeleteDocument} // Pass the non-async function
      />
    </div>
  );
}