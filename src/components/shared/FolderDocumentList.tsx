'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Document, SortKey, SortDirection } from '@/types/document';
import { useAuth } from '@/contexts/AuthContext';
import { PaginationControls } from '@/components/user/PaginationControls';
import { SortableHeader } from '@/components/user/SortableHeader';
import { createClient } from '@/lib/supabase/browser-client';
import JSZip from 'jszip';
import { createPortal } from 'react-dom';
import DeleteDocumentModal from '@/components/admin/DeleteDocumentModal';
import { LanguageFlag } from '@/components/admin/syllabus/LanguageFlag';

// Icons
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface FolderDocumentListProps {
  documents: Document[];
  isLoading: boolean;
  categoryName: string;
  userRole: 'user' | 'editor' | 'admin';
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}

// Number of items to display per page
const ITEMS_PER_PAGE = 10;

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export default function FolderDocumentList({
  documents,
  isLoading,
  categoryName,
  userRole,
  sortKey,
  sortDirection,
  onSort
}: FolderDocumentListProps) {
  const { supabase } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [generatingUrl, setGeneratingUrl] = useState<string | null>(null);
  const [downloadingFolder, setDownloadingFolder] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination calculations
  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDocuments = documents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

    const toggleDropdown = (docId: string, buttonElement?: HTMLButtonElement) => {
    if (activeDropdown === docId) {
      setActiveDropdown(null);
    } else {
      // Calculate dropdown position if button element is provided
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right - 150 + window.scrollX, // Position dropdown to the left of the button
        });
      }
      setActiveDropdown(docId);
    }
  };

    const handleDeleteClick = (doc: Document) => {
    setDocumentToDelete(doc);
    setDeleteModalOpen(true);
    setActiveDropdown(null); // Close dropdown
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentToDelete.id);

      if (error) {
        throw error;
      }

      // Close modal and refresh the page or update documents list
      setDeleteModalOpen(false);
      setDocumentToDelete(null);
      window.location.reload(); // Simple refresh - you might want to update the documents list instead

    } catch (err) {
      console.error('Error deleting document:', err);
      alert(`Failed to delete document: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  // Get the correct paths based on user role
  const getDocumentPaths = (docId: string) => {
    switch (userRole) {
      case 'admin':
        return {
          view: `/dashboard/admin/documents/${docId}`,
          edit: `/dashboard/admin/documents/${docId}/edit`
        };
      case 'editor':
        return {
          view: `/dashboard/editor/documents/${docId}`,
          edit: `/dashboard/editor/documents/${docId}/edit`
        };
      case 'user':
      default:
        return {
          view: `/dashboard/user/documents/${docId}`,
          edit: null // Users can't edit
        };
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        const target = event.target as Element;
        if (!target.closest('.dropdown-button') && !target.closest('.dropdown-menu')) {
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

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
        .from('documents')
        .createSignedUrl(filePath, 60 * 5); // 5-minute expiry

      if (error) {
        console.error('Error creating signed URL:', error);
        throw error;
      }

      if (data?.signedUrl) {
        console.log('Generated Signed URL for doc:', doc.id);
        window.open(data.signedUrl, '_blank');
      } else {
        throw new Error("Failed to generate signed URL.");
      }

    } catch (err) {
      console.error('Download failed for doc:', doc.id, err);
      alert(`Failed to download file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setGeneratingUrl(null);
    }
  };

  const handleDownloadFolder = async () => {
    if (documents.length === 0) {
      alert('No documents to download in this folder.');
      return;
    }

    setDownloadingFolder(true);
    try {
      const zip = new JSZip();
      const supabase = createClient();

      // Create a folder in the zip with the category name
      const folder = zip.folder(categoryName);
      if (!folder) {
        throw new Error('Failed to create folder in zip');
      }

      // Download all documents and add them to the zip
      const downloadPromises = documents.map(async (doc) => {
        if (!doc.content_url) {
          console.warn(`Skipping document ${doc.title} - no content URL`);
          return;
        }

        try {
          // Get signed URL for the document
          const { data: urlData, error: urlError } = await supabase.storage
            .from('documents')
            .createSignedUrl(doc.content_url, 60 * 5);

          if (urlError || !urlData?.signedUrl) {
            console.error(`Failed to get signed URL for ${doc.title}:`, urlError);
            return;
          }

          // Fetch the file content
          const response = await fetch(urlData.signedUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${doc.title}: ${response.statusText}`);
          }

          const blob = await response.blob();

          // Determine file extension
          const fileExtension = doc.file_type ?
            (doc.file_type.startsWith('.') ? doc.file_type : `.${doc.file_type}`) :
            '';

          // Sanitize filename for zip
          const sanitizedTitle = doc.title.replace(/[<>:"/\\|?*]/g, '_');
          const fileName = `${sanitizedTitle}${fileExtension}`;

          // Add file to zip
          folder.file(fileName, blob);
          console.log(`Added ${fileName} to zip`);

        } catch (err) {
          console.error(`Error downloading ${doc.title}:`, err);
          // Continue with other files even if one fails
        }
      });

      // Wait for all downloads to complete
      await Promise.all(downloadPromises);

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);

      // Create download link
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `${categoryName.replace(/[<>:"/\\|?*]/g, '_')}_documents.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(zipUrl);

      console.log(`Successfully downloaded folder: ${categoryName}`);

    } catch (err) {
      console.error('Failed to download folder:', err);
      alert(`Failed to download folder: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDownloadingFolder(false);
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
        <p className="text-gray-500 mb-4">There are currently no documents in the "{categoryName}" folder.</p>
      </div>
    );
  }

  // --- Render Document Table and Pagination ---
  return (
    <div className="space-y-4">
      {/* Download Folder Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            Documents in "{categoryName}" ({documents.length})
          </h2>
        </div>
        <button
          onClick={() => void handleDownloadFolder()}
          disabled={downloadingFolder}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloadingFolder ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowDownTrayIcon className="h-4 w-4" />
          )}
          {downloadingFolder ? 'Downloading...' : 'Download Folder'}
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader label="Name" columnKey="title" {...{ sortKey, sortDirection, onSort }} />
                <SortableHeader label="Type" columnKey="file_type" {...{ sortKey, sortDirection, onSort }} />
                <SortableHeader label="Lang" columnKey="language" {...{ sortKey, sortDirection, onSort }} />
                <SortableHeader label="Region" columnKey="region" {...{ sortKey, sortDirection, onSort }} />
                <SortableHeader label="Author" columnKey="author_name" {...{ sortKey, sortDirection, onSort }} />
                <SortableHeader label="Created" columnKey="created_at" {...{ sortKey, sortDirection, onSort }} />
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedDocuments.map((doc) => {
                const isDropdownOpen = activeDropdown === doc.id;
                const isDownloading = generatingUrl === doc.id;
                const paths = getDocumentPaths(doc.id);

                return (
                  <tr key={doc.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center mr-4">
                          <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-700">
                              {doc.file_type ? doc.file_type.substring(0, 3).toUpperCase() : 'DOC'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <Link
                              href={paths.view}
                              className="hover:text-accent-primary transition-colors"
                            >
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
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                        {doc.file_type ? doc.file_type.toUpperCase() : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <LanguageFlag languageName={doc.language || null} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {doc.region || '--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {doc.author_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatDate(doc.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      {userRole === 'user' ? (
                        // Regular users only get download button
                        <button
                          onClick={() => void handleDownload(doc)}
                          disabled={isDownloading}
                          className="inline-flex items-center text-gray-500 hover:text-accent-primary focus:outline-none"
                          title="Download document"
                        >
                          {isDownloading ? (
                            <ArrowPathIcon className="h-5 w-5 animate-spin" />
                          ) : (
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          )}
                          <span className="sr-only">Download</span>
                        </button>
                      ) : (
                        // Admin and Editor get three-dots menu
                        <div className="relative">
                          <button
                            onClick={(e) => toggleDropdown(doc.id, e.currentTarget)}
                            className="dropdown-button text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-md hover:bg-gray-100"
                            aria-haspopup="true"
                            aria-expanded={isDropdownOpen}
                          >
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                          </button>

                          {isDropdownOpen && typeof document !== 'undefined' && createPortal(
                            <div
                              className="dropdown-menu fixed shadow-lg bg-white rounded-md ring-1 ring-black ring-opacity-5 z-50"
                              style={{
                                top: `${dropdownPosition.top}px`,
                                left: `${dropdownPosition.left}px`,
                              }}
                            >
                              <div className="py-1" role="menu" aria-orientation="vertical">
                                <Link
                                  href={paths.view}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                  role="menuitem"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <EyeIcon className="h-4 w-4" />
                                  View
                                </Link>
                                {paths.edit && (
                                  <Link
                                    href={paths.edit}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                                    role="menuitem"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                    Edit
                                  </Link>
                                )}
                                <button
                                  onClick={() => void handleDownload(doc)}
                                  disabled={isDownloading}
                                  className={`flex items-center gap-2 px-4 py-2 text-sm w-full text-left ${isDownloading ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                                  role="menuitem"
                                >
                                  {isDownloading ? (
                                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                  )}
                                  {isDownloading ? 'Generating...' : 'Download'}
                                </button>
                                {userRole === 'admin' && (
                                  <button
                                    onClick={() => handleDeleteClick(doc)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 w-full text-left"
                                    role="menuitem"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>,
                            document.body
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
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

      {/* Delete Document Modal */}
      <DeleteDocumentModal
        isOpen={deleteModalOpen}
        documentTitle={documentToDelete?.title || ''}
        onClose={handleDeleteCancel}
        onConfirm={() => void handleDeleteConfirm()}
        isDeleting={isDeleting}
      />
    </div>
  );
}