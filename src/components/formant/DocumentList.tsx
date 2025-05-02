'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Document, SortKey, SortDirection } from '@/types/document';
import { useAuth } from '@/contexts/AuthContext';
import { DocumentRow } from './DocumentRow';
import { PaginationControls } from './PaginationControls';
import { SortableHeader } from './SortableHeader';

// Icons
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
// Removed react-icons imports

// Assume SortKey and SortDirection types are passed via props from DashboardPage
// Need to import them if defined in a shared types file instead

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDelete?: (id: string) => void;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}

// Number of items to display per page
const ITEMS_PER_PAGE = 10;

// Helper function to format dates (consider moving to a utils file)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Re-added Helper for Language Abbreviations
const _getLanguageCode = (language: string | null | undefined): string => {
  if (!language) return '--';
  const lowerLang = language.toLowerCase().trim();
  if (lowerLang.startsWith('en') || lowerLang === 'english') return 'EN';
  if (lowerLang.startsWith('fr') || lowerLang === 'french') return 'FR';
  if (lowerLang.startsWith('es') || lowerLang === 'spanish') return 'ES';
  if (lowerLang.startsWith('de') || lowerLang === 'german') return 'DE';
  if (lowerLang.startsWith('it') || lowerLang === 'italian') return 'IT';
  if (lowerLang.startsWith('pt') || lowerLang === 'portuguese') return 'PT';
  return language.substring(0, 2).toUpperCase();
};

export default function DocumentList({
  documents,
  isLoading,
  onDelete,
  sortKey,
  sortDirection,
  onSort
}: DocumentListProps) {
  const { supabase } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [generatingUrl, setGeneratingUrl] = useState<string | null>(null);

  // Pagination calculations
  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDocuments = documents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setActiveDropdown(null); // Close dropdown when changing page
  };

  const toggleDropdown = (docId: string) => {
    setActiveDropdown(activeDropdown === docId ? null : docId);
  };

  const handleDownload = async (doc: Document) => {
    if (!doc.content_url) {
      console.error('No file path found for this document.', doc.id);
      alert('Download failed: No file path available.');
      return;
    }
    setGeneratingUrl(doc.id);
    try {
      const filePath = doc.content_url;
      const { data, error } = await supabase.storage
        .from('media') // Adjusted bucket name
        .createSignedUrl(filePath, 60 * 5); // 5-minute expiry

      if (error) {
        console.error('Error creating signed URL:', error);
        throw error;
      }

      if (data?.signedUrl) {
        console.log('Generated Signed URL for doc:', doc.id);
        // Use window.open for better compatibility, especially on mobile
        window.open(data.signedUrl, '_blank');
      } else {
          throw new Error("Failed to generate signed URL.");
      }

    } catch (err) {
      console.error('Download failed for doc:', doc.id, err);
      alert(`Failed to download file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setGeneratingUrl(null);
      setActiveDropdown(null); // Close dropdown after download attempt
    }
  };

  // --- Render Loading State ---
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <ArrowPathIcon className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-2" />
        Loading documents...
      </div>
    );
  }

  // --- Render Empty State ---
  if (documents.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MagnifyingGlassIcon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium text-black mb-1">No documents found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your search filters.</p>
        <Link
          href="/dashboard/admin/documents/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-accent-primary hover:bg-accent-primary/90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
           </svg>
          Create New Document
        </Link>
      </div>
    );
  }

  // --- Render Document Table and Pagination ---
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader label="Name" columnKey="title" {...{ sortKey, sortDirection, onSort }} />
              <SortableHeader label="Type" columnKey="file_type" {...{ sortKey, sortDirection, onSort }} />
              <SortableHeader label="Lang" columnKey="language" {...{ sortKey, sortDirection, onSort }} />
              <SortableHeader label="Region" columnKey="region" {...{ sortKey, sortDirection, onSort }} />
              <SortableHeader label="Category" columnKey="category" {...{ sortKey, sortDirection, onSort }} />
              <SortableHeader label="Created" columnKey="created_at" {...{ sortKey, sortDirection, onSort }} />
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedDocuments.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                region={doc.region}
                formattedDate={formatDate(doc.created_at)}
                activeDropdown={activeDropdown}
                generatingUrl={generatingUrl}
                toggleDropdown={toggleDropdown}
                handleDownload={handleDownload}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Render Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}