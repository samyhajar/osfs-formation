'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PaginationControls } from '@/components/user/PaginationControls';
import { SortableHeader } from '@/components/user/SortableHeader';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { LanguageFlag } from '@/components/admin/syllabus/LanguageFlag';
import WorkshopFileEditForm from '@/components/admin/workshops/WorkshopFileEditForm';
import JSZip from 'jszip';

// Icons
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

// Define workshop file type
// Use the proper database type
type WorkshopFile = Database['public']['Tables']['workshop_files']['Row'];

// Import sort types from document types
import { SortKey, SortDirection } from '@/types/document';

interface WorkshopFilesListProps {
  workshopId: string;
  workshopTitle: string;
  userRole: 'user' | 'editor' | 'admin';
  onTitleEdit?: (newTitle: string) => void;
}

// Number of items to display per page
const ITEMS_PER_PAGE = 10;

// Helper function to format dates
const _formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Helper function to format file size
const _formatFileSize = (bytes: number | null) => {
  if (!bytes) return 'Unknown';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export default function WorkshopFilesList({
  workshopId,
  workshopTitle,
  userRole,
  onTitleEdit: _onTitleEdit
}: WorkshopFilesListProps) {
  const { supabase } = useAuth();
  const [files, setFiles] = useState<WorkshopFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [generatingUrl, setGeneratingUrl] = useState<string | null>(null);
  const [downloadingFolder, setDownloadingFolder] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [editingFile, setEditingFile] = useState<WorkshopFile | null>(null);

  const isAdminOrEditor = userRole === 'admin' || userRole === 'editor';

  // Pagination calculations
  const totalPages = Math.ceil(files.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFiles = files.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSort = (key: SortKey) => {
    if (key === null) {
      setSortKey(null);
      setSortDirection(null);
    } else if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection(key === 'created_at' ? 'desc' : 'asc');
    }
  };

  const handleDownload = async (file: WorkshopFile) => {
    if (!file.file_path) {
      console.error('No file path found for this file.', file.id);
      alert('Download failed: No file path available.');
      return;
    }
    setGeneratingUrl(file.id);
    try {
      const filePath = file.file_path;
      const { data, error } = await supabase.storage
        .from('workshops') // Assuming workshop files are in 'workshops' bucket
        .createSignedUrl(filePath, 60 * 5); // 5-minute expiry

      if (error) {
        console.error('Error creating signed URL:', error);
        throw error;
      }

      if (data?.signedUrl) {
        console.log('Generated Signed URL for file:', file.id);
        window.open(data.signedUrl, '_blank');
      } else {
        throw new Error("Failed to generate signed URL.");
      }

    } catch (err) {
      console.error('Download failed for file:', file.id, err);
      alert(`Failed to download file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setGeneratingUrl(null);
    }
  };

  const handleDownloadFolder = async () => {
    if (files.length === 0) {
      alert('No files to download in this workshop.');
      return;
    }

    setDownloadingFolder(true);
    try {
      const zip = new JSZip();
      const supabase = createClient();

      // Create a folder in the zip with the workshop title
      const folder = zip.folder(workshopTitle);
      if (!folder) {
        throw new Error('Failed to create folder in zip');
      }

      // Download all files and add them to the zip
      const downloadPromises = files.map(async (file) => {
        if (!file.file_path) {
          console.warn(`Skipping file ${file.title} - no file path`);
          return;
        }

        try {
          // Get signed URL for the file
          const { data: urlData, error: urlError } = await supabase.storage
            .from('workshops')
            .createSignedUrl(file.file_path, 60 * 5);

          if (urlError || !urlData?.signedUrl) {
            console.error(`Failed to get signed URL for ${file.title}:`, urlError);
            return;
          }

          // Fetch the file content
          const response = await fetch(urlData.signedUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${file.title}: ${response.statusText}`);
          }

          const blob = await response.blob();

          // Determine file extension
          const fileExtension = file.file_type ?
            (file.file_type.startsWith('.') ? file.file_type : `.${file.file_type}`) :
            '';

          // Sanitize filename for zip
          const sanitizedTitle = file.title.replace(/[<>:"/\\|?*]/g, '_');
          const fileName = `${sanitizedTitle}${fileExtension}`;

          // Add file to zip
          folder.file(fileName, blob);
          console.log(`Added ${fileName} to zip`);

        } catch (err) {
          console.error(`Error downloading ${file.title}:`, err);
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
      link.download = `${workshopTitle.replace(/[<>:"/\\|?*]/g, '_')}_workshop.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(zipUrl);

      console.log(`Successfully downloaded workshop: ${workshopTitle}`);

    } catch (err) {
      console.error('Failed to download workshop:', err);
      alert(`Failed to download workshop: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDownloadingFolder(false);
    }
  };

  // Get the correct file viewer path based on user role
  const getFileViewerPath = (file: WorkshopFile) => {
    // Use the actual file path from storage as the identifier
    const filePathEncoded = encodeURIComponent(file.file_path);
    switch (userRole) {
      case 'admin':
        return `/dashboard/admin/workshops/${workshopId}/file/${filePathEncoded}`;
      case 'editor':
        return `/dashboard/editor/workshops/${workshopId}/file/${filePathEncoded}`;
      case 'user':
      default:
        return `/dashboard/user/workshops/${workshopId}/file/${filePathEncoded}`;
    }
  };

  const handleFileEditSave = (updatedFile: WorkshopFile) => {
    // Update the file in the local state
    setFiles(prevFiles =>
      prevFiles.map(f => f.id === updatedFile.id ? updatedFile : f)
    );
    setEditingFile(null);
  };

  const handleFileEditCancel = () => {
    setEditingFile(null);
  };

  const handleDeleteWorkshop = (file: WorkshopFile) => {
    void (async () => {
      if (confirm(`Are you sure you want to delete "${file.title}"? This will delete the entire workshop since it's the only file.`)) {
        try {
          // Delete file from storage
          const { error: storageError } = await supabase.storage
            .from('workshops')
            .remove([file.file_path]);

          if (storageError) {
            console.error('Storage deletion error:', storageError);
          }

          // Since we're using single file workshops, delete the entire workshop record
          const { error: dbError } = await supabase
            .from('workshops')
            .delete()
            .eq('id', workshopId);

          if (dbError) {
            console.error('Database deletion error:', dbError);
            alert('Failed to delete workshop from database');
          } else {
            // Navigate back to workshops list since workshop is deleted
            alert('Workshop deleted successfully');
            // Redirect to workshops list
            window.location.href = `/dashboard/${userRole}/workshops`;
          }
        } catch (err) {
          console.error('Error deleting workshop:', err);
          alert('Failed to delete workshop');
        }
      }
      setShowActionsMenu(null);
    })();
  };

    // Close actions menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowActionsMenu(null);
    };

    if (showActionsMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showActionsMenu]);

  // Fetch real workshop files from database
  React.useEffect(() => {
    const fetchWorkshopFiles = async () => {
      if (!workshopId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // First try to fetch from workshop_files table (new structure)
        const { data: workshopFilesData, error: filesError } = await supabase
          .from('workshop_files')
          .select('*')
          .eq('workshop_id', workshopId)
          .order('created_at', { ascending: false });

        if (!filesError && workshopFilesData && workshopFilesData.length > 0) {
          // Found files in new structure
          setFiles(workshopFilesData);
        } else {
          // Fallback: check legacy workshop data in main workshops table
          const { data: workshopData, error: workshopError } = await supabase
            .from('workshops')
            .select('*')
            .eq('id', workshopId)
            .single();

          if (workshopError) {
            console.error('Error fetching workshop:', workshopError);
            setFiles([]);
            return;
          }

          // Convert workshop data to file format if it has file information
          if (workshopData && workshopData.file_path) {
            // Create a file entry from the workshop data
            const legacyFile: WorkshopFile = {
              id: workshopData.id, // Use workshop ID as file ID for legacy files
              workshop_id: workshopData.id,
              title: workshopData.title,
              description: workshopData.description || null,
              file_path: workshopData.file_path,
              file_type: workshopData.file_path.split('.').pop()?.toLowerCase() || null,
              file_size: null, // Legacy workshops don't store file size
              file_url: null,
              region: null,
              language: null,
              author: null,
              topics: null,
              keywords: null,
              created_at: workshopData.created_at,
              updated_at: workshopData.updated_at || workshopData.created_at
            };

            setFiles([legacyFile]);
          } else {
            setFiles([]);
          }
        }
      } catch (err) {
        console.error('Error fetching workshop files:', err);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchWorkshopFiles();
  }, [workshopId, supabase]);

  // --- Render Loading State ---
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <ArrowPathIcon className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-2" />
        Loading workshop files...
      </div>
    );
  }

  // --- Render Empty State ---
  if (files.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-8 text-center">
        <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MagnifyingGlassIcon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-medium text-black mb-1">No files found</h3>
        <p className="text-gray-500 mb-4">This workshop currently contains no files.</p>
      </div>
    );
  }

  // --- Render Files Table and Pagination ---
  return (
    <div className="space-y-6">
      {/* Workshop Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-gray-900">{workshopTitle}</h1>
            {isAdminOrEditor && (
              <Link
                href={`/dashboard/${userRole}/workshops/${workshopId}/edit`}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Edit workshop"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>

        {/* Download Button */}
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

      {/* Workshop Files Section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            Workshop Files ({files.length})
          </h2>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
                             <tr>
                 <SortableHeader label="Name" columnKey="title" {...{ sortKey, sortDirection, onSort: handleSort }} />
                 <SortableHeader label="Type" columnKey="file_type" {...{ sortKey, sortDirection, onSort: handleSort }} />
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Lang
                 </th>
                 <SortableHeader label="Region" columnKey="region" {...{ sortKey, sortDirection, onSort: handleSort }} />
                 <SortableHeader label="Author" columnKey="author" {...{ sortKey, sortDirection, onSort: handleSort }} />
                 <th scope="col" className="relative px-6 py-3">
                   <span className="sr-only">Actions</span>
                 </th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center mr-4">
                        <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700">
                            {file.file_type ? file.file_type.substring(0, 3).toUpperCase() : 'FILE'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          <Link
                            href={getFileViewerPath(file)}
                            className="hover:text-accent-primary transition-colors"
                          >
                            {file.title}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                      {file.file_type ? file.file_type.toUpperCase() : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {file.language && (
                      <LanguageFlag languageName={file.language} />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {file.region && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {file.region}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {file.author || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Button */}
                      <Link
                        href={getFileViewerPath(file)}
                        className="inline-flex items-center text-gray-500 hover:text-blue-600 focus:outline-none"
                        title="View file"
                      >
                        <EyeIcon className="h-5 w-5" />
                        <span className="sr-only">View</span>
                      </Link>

                      {/* Download Button */}
                      <button
                        onClick={() => void handleDownload(file)}
                        disabled={generatingUrl === file.id}
                        className="inline-flex items-center text-gray-500 hover:text-green-600 focus:outline-none"
                        title="Download file"
                      >
                        {generatingUrl === file.id ? (
                          <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        ) : (
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        )}
                        <span className="sr-only">Download</span>
                      </button>

                      {/* Actions Menu for Admin/Editor */}
                      {isAdminOrEditor && (
                        <div className="relative">
                          <button
                            onClick={() => setShowActionsMenu(showActionsMenu === file.id ? null : file.id)}
                            className="inline-flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                            title="More actions"
                          >
                            <EllipsisHorizontalIcon className="h-5 w-5" />
                            <span className="sr-only">Actions</span>
                          </button>

                          {showActionsMenu === file.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    setEditingFile(file);
                                    setShowActionsMenu(null);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <PencilSquareIcon className="h-4 w-4 mr-3" />
                                  Edit File
                                </button>
                                <Link
                                  href={`/dashboard/${userRole}/workshops/${workshopId}/edit`}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => setShowActionsMenu(null)}
                                >
                                  <PencilSquareIcon className="h-4 w-4 mr-3" />
                                  Edit Workshop
                                </Link>
                                <button
                                  onClick={() => handleDeleteWorkshop(file)}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                >
                                  <TrashIcon className="h-4 w-4 mr-3" />
                                  Delete File
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
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

      {/* File Edit Modal */}
      {editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <WorkshopFileEditForm
              file={editingFile}
              onSave={handleFileEditSave}
              onCancel={handleFileEditCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}