'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import DocumentsFilters from '@/components/dashboard/DocumentsFilters';
import DocumentList from '@/components/dashboard/DocumentList';
import { Database } from '@/types/supabase';
import { Document } from '@/types/document';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the recommended client for Next.js
        const supabase = createClientComponentClient<Database>();

        let query = supabase.from('documents').select('*');

        if (filters.category) {
          query = query.eq('category', filters.category);
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
          query = query.textSearch('keywords', filters.keywords);
        }
        if (filters.topics.length > 0) {
          query = query.overlaps('topics', filters.topics);
        }
        if (filters.purpose.length > 0) {
          query = query.overlaps('purpose', filters.purpose);
        }

        const { data, error } = await query;

        if (error) {
          setError(`Failed to fetch documents: ${error.message}`);
          setDocuments([]);
        } else {
          setDocuments(data as Document[] || []);
        }
      } catch (err: any) {
        setError(`Unexpected error: ${err.message}`);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDocuments();
    }
  }, [filters, user]);

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
          href="/dashboard/documents/new"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create document
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <DocumentsFilters filters={filters} onFilterChange={handleFilterChange} />

      <DocumentList
        documents={documents}
        isLoading={loading}
        onDelete={handleDeleteDocument}
      />
    </div>
  );
}