'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import DocumentsFilters from '@/components/shared/DocumentsFilters';
import DocumentList from '@/components/editor/DocumentList';
import DeleteDocumentModal from '@/components/admin/DeleteDocumentModal';
import { DocumentCategory, DocumentPurpose, SortKey, SortDirection } from '@/types/document';
import { useAuth } from '@/contexts/AuthContext';
import { useDocumentDeletion } from '@/hooks/useDocumentDeletion';
import { useEditorDocuments } from '@/hooks/useEditorDocuments';

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

export default function DashboardPage() {
  const { loading: authLoading } = useAuth();
  const [filters, setFilters] = useState<PageFilterState>({
    category: '',
    region: '',
    language: '',
    author: '',
    keywords: '',
    topics: [],
    purpose: []
  });

  // --- Sorting State ---
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // --- Use custom hooks ---
  const { documents, loading, error, setError, categoryCounts } = useEditorDocuments(filters, authLoading);
  const {
    documentToDelete,
    isDeleting,
    handleDeleteDocument,
    confirmDeleteDocument,
    cancelDelete
  } = useDocumentDeletion(documents, setError);


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
      return documents;
    }

    return [...documents].sort((a, b) => {
      let valA: string | null | undefined;
      let valB: string | null | undefined;

      switch (sortKey) {
        case 'created_at':
          valA = a.created_at;
          valB = b.created_at;
          break;
        case 'title':
          valA = a.title;
          valB = b.title;
          break;
        case 'category':
          valA = a.category;
          valB = b.category;
          break;
        case 'file_type':
          valA = a.file_type;
          valB = b.file_type;
          break;
        case 'language':
          valA = a.language;
          valB = b.language;
          break;
        case 'region':
          valA = a.region;
          valB = b.region;
          break;
        default:
          return 0;
      }

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


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold text-black">Documents</h1>
           <p className="text-gray-500 mt-1">Browse and manage all documents.</p>
        </div>
        <Link
          href="/dashboard/editor/documents/new"
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
        documents={sortedDocuments}
        isLoading={loading}
        onDelete={handleDeleteDocument}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      {/* Delete Confirmation Modal */}
      {documentToDelete && (
        <DeleteDocumentModal
          isOpen={!!documentToDelete}
          documentTitle={documentToDelete.title}
          onClose={cancelDelete}
          onConfirm={confirmDeleteDocument}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}