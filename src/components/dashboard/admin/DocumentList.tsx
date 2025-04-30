'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Document } from '@/types/document';
import { FileIcon } from '@/components/ui/FileIcon';
import { useAuth } from '@/contexts/AuthContext';

// Icons
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface DocumentListProps {
  documents: Document[];
  isLoading: boolean;
  onDelete?: (id: string) => void;
}

export default function DocumentList({
  documents,
  isLoading,
  onDelete
}: DocumentListProps) {
  const { supabase } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [generatingUrl, setGeneratingUrl] = useState<string | null>(null);

  // Pagination
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = documents.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const toggleDropdown = (docId: string) => {
    setActiveDropdown(activeDropdown === docId ? null : docId);
  };

  const handleDownload = async (doc: Document) => {
    if (!doc.content_url) {
      console.error('No file path found for this document.');
      return;
    }
    setGeneratingUrl(doc.id);
    try {
      const filePath = doc.content_url;
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 60 * 5);

      if (error) {
        console.error('Error creating signed URL:', error);
        throw error;
      }

      if (data?.signedUrl) {
        console.log('Generated Signed URL:', data.signedUrl);
        window.location.href = data.signedUrl;
      } else {
          throw new Error("Failed to generate signed URL.")
      }

    } catch (err) {
      console.error('Download failed:', err);
      alert(`Failed to download file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setGeneratingUrl(null);
      setActiveDropdown(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <ArrowPathIcon className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-2" />
        Loading documents...
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MagnifyingGlassIcon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium text-black mb-1">No documents found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your search filters.</p>
        <Link
          href="/dashboard/documents/new"
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

  console.log("Rendering documents:", documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    type: doc.file_type,
    category: doc.category,
    content_url: doc.content_url
  })));

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedDocuments.map((doc) => {
              return (
                <tr key={doc.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center mr-4">
                         <FileIcon fileType={doc.file_type ?? undefined} size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          <Link href={`/dashboard/documents/${doc.id}`} className="hover:text-accent-primary transition-colors">
                            {doc.title}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500">
                          By {doc.author_name || 'Unknown Author'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-gray-700">
                      {doc.file_type ? doc.file_type.toUpperCase() : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {doc.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(doc.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={() => toggleDropdown(doc.id)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-md hover:bg-gray-100"
                    >
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </button>

                    {activeDropdown === doc.id && (
                      <div
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
                        style={{ top: '100%' }}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <Link
                            href={`/dashboard/documents/${doc.id}`}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                          >
                            <MagnifyingGlassIcon className="mr-3 h-4 w-4 text-gray-400" />
                            View Details
                          </Link>
                          <Link
                            href={`/dashboard/documents/${doc.id}/edit`}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                          >
                            <PencilIcon className="mr-3 h-4 w-4 text-gray-400" />
                            Edit Document
                          </Link>
                          <button
                             onClick={() => handleDownload(doc)}
                             disabled={!doc.content_url || !!generatingUrl}
                             className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                               !doc.content_url || generatingUrl === doc.id ? 'opacity-50 cursor-not-allowed' : ''
                             }`}
                             role="menuitem"
                          >
                            {generatingUrl === doc.id ? (
                               <ArrowPathIcon className="mr-3 h-4 w-4 text-gray-400 animate-spin" />
                            ) : (
                               <ArrowDownTrayIcon className="mr-3 h-4 w-4 text-gray-400" />
                            )}
                            {generatingUrl === doc.id ? 'Generating...' : 'Download'}
                          </button>
                          {onDelete && (
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                if (confirm('Are you sure you want to delete this document? THIS ACTION CANNOT BE UNDONE.')) {
                                  onDelete(doc.id);
                                }
                              }}
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                              role="menuitem"
                            >
                              <TrashIcon className="mr-3 h-4 w-4 text-red-400" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-white">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 disabled:opacity-50`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 disabled:opacity-50`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, documents.length)}
                </span>{' '}
                of <span className="font-medium">{documents.length}</span> documents
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 border-accent-primary text-accent-primary bg-accent-primary/10'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    (page === currentPage - 2 && currentPage > 3) ||
                    (page === currentPage + 2 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={page}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}