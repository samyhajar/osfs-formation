'use client';

import { useState, useEffect, useMemo } from 'react';
import DocumentsFilters from '@/components/shared/DocumentsFilters';
import DocumentList from '@/components/user/DocumentList';
import { Database } from '@/types/supabase';
import { Document, DocumentCategory, DocumentPurpose, SortKey, SortDirection } from '@/types/document';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/browser-client';
import React from 'react';
import { convertToDocuments } from '@/lib/utils/document-utils';

// Define the filter state type matching the component's expected props
interface PageFilterState {
  category: DocumentCategory | ''; // Match the expected type
  region: string;
  language: string;
  author: string;
  keywords: string;
  topics: string[];
  purpose: DocumentPurpose[]; // Match the expected type
}

export default function DocumentsPage() {
  const { loading: authLoading } = useAuth();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryCounts, setCategoryCounts] = useState<Record<DocumentCategory, number>>({} as Record<DocumentCategory, number>);
  // Apply the PageFilterState type to useState
  const [filters, setFilters] = useState<PageFilterState>({
    category: '', // Ensure initial value matches type
    region: '',
    language: '',
    author: '',
    keywords: '',
    topics: [],
    purpose: [] // Ensure initial value matches type
  });

  // --- Sorting State ---
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    // Wrap async logic in IIFE
    const fetchDocuments = async () => {
      console.log("DocumentsPage: Fetching documents...");
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
          keywords
          `);

        // Apply filters
        if (filters.category) query = query.eq('category', filters.category);
        if (filters.region) query = query.eq('region', filters.region);
        if (filters.language) query = query.eq('language', filters.language);
        if (filters.author) query = query.ilike('author_name', `%${filters.author}%`);
        if (filters.keywords) query = query.or(`title.ilike.%${filters.keywords}%,description.ilike.%${filters.keywords}%`);
        if (filters.topics.length > 0) query = query.overlaps('topics', filters.topics);
        if (filters.purpose.length > 0) query = query.overlaps('purpose', filters.purpose);

        console.log("DocumentsPage: Executing Supabase query...");
        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error("DocumentsPage: Fetch error:", fetchError);
          setError(`Failed to fetch documents: ${fetchError.message}`);
          setDocuments([]);
        } else {
          console.log("DocumentsPage: Documents fetched successfully:", data?.length || 0);
          if (!data || !Array.isArray(data)) {
            console.error("DocumentsPage: Invalid data returned:", data);
            setError("Invalid data format returned from the server");
            setDocuments([]);
          } else {
            setDocuments(convertToDocuments(data));
          }
        }
      } catch (err: unknown) {
        console.error("DocumentsPage: Unexpected error:", err);
        setError(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
        setDocuments([]);
      } finally {
        setLoading(false);
        console.log("DocumentsPage: fetchDocuments finished. Loading:", false);
      }
    };

    void fetchDocuments();

  }, [filters, authLoading]);

  useEffect(() => {
    // Wrap async logic in IIFE
    const fetchCategoryCounts = async () => {
      const supabase = createClient<Database>();
      const { data, error: rpcError } = await supabase.rpc('get_category_counts');

      if (rpcError) {
        console.error("DocumentsPage: Error fetching category counts via RPC:", rpcError);
        setCategoryCounts({} as Record<DocumentCategory, number>);
      } else {
        const counts = data?.reduce((acc: Record<DocumentCategory, number>, item: { category: DocumentCategory; count: number | bigint }) => {
          acc[item.category] = Number(item.count);
          return acc;
        }, {} as Record<DocumentCategory, number>) || {} as Record<DocumentCategory, number>;
        console.log("DocumentsPage: Category counts fetched:", counts);
        setCategoryCounts(counts);
      }
    };
    void fetchCategoryCounts();
  }, []);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  // --- Sort Handler ---
  const handleSort = (key: SortKey) => {
    if (key === null) {
      // Clear sorting
      setSortKey(null);
      setSortDirection(null);
    } else if (sortKey === key) {
      // Toggle direction
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // New key, set default direction (e.g., 'asc' for text, 'desc' for date)
      setSortKey(key);
      setSortDirection(key === 'created_at' ? 'desc' : 'asc');
    }
  };

  // --- Memoized Sorted Documents ---
  const sortedDocuments = useMemo(() => {
    if (!sortKey || !sortDirection) {
      return documents; // Return original order if no sorting applied
    }

    return [...documents].sort((a, b) => {
      const sortKeyAsserted = sortKey as keyof Document; // Assert non-null key here
      const valA = a[sortKeyAsserted];
      const valB = b[sortKeyAsserted];

      // Handle null/undefined - Treat nulls/undefined as "lesser"
      if (valA == null && valB != null) return sortDirection === 'asc' ? -1 : 1;
      if (valA != null && valB == null) return sortDirection === 'asc' ? 1 : -1;
      if (valA == null && valB == null) return 0;

      // At this point, valA and valB are guaranteed to be non-null
      let comparison = 0;
      if (sortKey === 'created_at' && typeof valA === 'string' && typeof valB === 'string') {
        comparison = new Date(valA).getTime() - new Date(valB).getTime();
      } else if ((sortKey === 'language' || sortKey === 'region' || sortKey === 'title' || sortKey === 'file_type' || sortKey === 'category') && typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else {
        // Fallback for other types or if types don't match expectations
        const strA = String(valA);
        const strB = String(valB);
        comparison = strA.localeCompare(strB);
      }

      return sortDirection === 'desc' ? comparison * -1 : comparison;
    });
  }, [documents, sortKey, sortDirection]);

  const handleDeleteDocument = (_id: string) => {
    console.log('Delete action triggered for document:', _id);
    // Document deletion logic will go here
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-black">Documents</h1>
           <p className="text-gray-500 mt-1">Browse and manage all documents.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <DocumentsFilters filters={filters} onFilterChange={handleFilterChange} categoryCounts={categoryCounts} />

      <DocumentList
        documents={sortedDocuments}
        isLoading={loading}
        onDelete={handleDeleteDocument}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
}