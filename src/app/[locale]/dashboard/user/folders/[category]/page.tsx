'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/browser-client';
import { Document, DocumentCategory, SortKey, SortDirection } from '@/types/document';
import { convertToDocuments } from '@/lib/utils/document-utils';
import FolderDocumentList from '@/components/shared/FolderDocumentList';

export default function CategoryDocumentsPage() {
  const params = useParams();
  const category = params?.category ? decodeURIComponent(params.category as string) as DocumentCategory : null;
  const basePath = '/dashboard/user/folders';

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Sorting State ---
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const fetchCategoryDocuments = useCallback(async () => {
    if (!category) {
      setError('Category not specified.');
      setLoading(false);
      return;
    }

    console.log(`Fetching documents for category: ${category}`);
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw fetchError;
      }

      console.log(`Fetched ${data?.length ?? 0} documents for ${category}`);
      setDocuments(convertToDocuments(data));

    } catch (err: unknown) {
      console.error('Error fetching documents:', err);
      setError(`Failed to load documents: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    void fetchCategoryDocuments();
  }, [fetchCategoryDocuments]);

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
      // New key, set default direction
      setSortKey(key);
      setSortDirection(key === 'created_at' ? 'desc' : 'asc');
    }
  };

  // --- Memoized Sorted Documents ---
  const sortedDocuments = useMemo(() => {
    if (!sortKey || !sortDirection) {
      return documents;
    }

    return [...documents].sort((a, b) => {
      const sortKeyAsserted = sortKey as keyof Document;
      const valA = a[sortKeyAsserted];
      const valB = b[sortKeyAsserted];

      // Handle null/undefined
      if (valA == null && valB != null) return sortDirection === 'asc' ? -1 : 1;
      if (valA != null && valB == null) return sortDirection === 'asc' ? 1 : -1;
      if (valA == null && valB == null) return 0;

      let comparison = 0;
      if (sortKey === 'created_at' && typeof valA === 'string' && typeof valB === 'string') {
        comparison = new Date(valA).getTime() - new Date(valB).getTime();
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else {
        const strA = String(valA);
        const strB = String(valB);
        comparison = strA.localeCompare(strB);
      }

      return sortDirection === 'desc' ? comparison * -1 : comparison;
    });
  }, [documents, sortKey, sortDirection]);

  if (!category) {
    return (
      <div className="flex flex-col h-full">
        <main className="flex-1 p-6 bg-gray-50">
          <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            Invalid category specified.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-6 bg-gray-50">
        {/* Back link and Title */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href={`${basePath}`}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to Folders"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            Documents in: <span className="text-blue-600">{category}</span>
          </h1>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Document Table */}
        <FolderDocumentList
          documents={sortedDocuments}
          isLoading={loading}
          categoryName={category}
          userRole="user"
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </main>
    </div>
  );
}