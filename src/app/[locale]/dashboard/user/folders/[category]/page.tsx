'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeftIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { Document, DocumentCategory } from '@/types/document';
import { SimpleDocumentCard } from '@/components/shared/SimpleDocumentCard';
import { convertToDocuments } from '@/lib/utils/document-utils';

export default function CategoryDocumentsPage() {
  const params = useParams();
  const category = params?.category ? decodeURIComponent(params.category as string) as DocumentCategory : null;
  const basePath = '/dashboard/user/folders';

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const supabase = createClient<Database>();
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
            {category ? (
              <>
                Documents in: <span className="text-blue-600">{category}</span>
              </>
            ) : (
              'Invalid Category'
            )}
          </h1>
        </div>

        {/* Document Grid Area */}
        <div>
          {loading && (
            <div className="flex justify-center items-center p-10">
              <ArrowPathIcon className="h-8 w-8 text-gray-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading documents...</span>
            </div>
          )}

          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-2">
               <ExclamationTriangleIcon className="h-5 w-5" />
              {error}
            </div>
          )}

          {!loading && !error && documents.length === 0 && (
            <div className="text-center p-8 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-lg font-medium text-gray-700">No Documents Found</h3>
              <p className="text-gray-500 mt-1">There are currently no documents in the "{category}" category.</p>
            </div>
          )}

          {!loading && !error && documents.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-x-1 gap-y-3">
              {documents.map((doc) => (
                <SimpleDocumentCard
                  key={doc.id}
                  document={doc}
                  hideActions={true} // Hide delete/edit actions for formee
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}