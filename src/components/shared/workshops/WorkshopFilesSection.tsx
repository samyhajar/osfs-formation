'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { DocumentIcon, PlusIcon } from '@heroicons/react/24/outline';
import FileUploadForm from '@/components/admin/workshops/FileUploadForm';
import WorkshopFileEditForm from '@/components/admin/workshops/WorkshopFileEditForm';
import { WorkshopFileItem } from '@/components/admin/workshops/WorkshopFileItem';
import toast from 'react-hot-toast';

type WorkshopFile = Database['public']['Tables']['workshop_files']['Row'];

interface WorkshopFilesSectionProps {
  showAddFileForm: boolean;
  setShowAddFileForm: (show: boolean) => void;
  workshop: {
    id: string;
    folder_path: string | null;
  } | null;
  workshopId: string;
}

export function WorkshopFilesSection({
  showAddFileForm,
  setShowAddFileForm,
  workshop,
  workshopId
}: WorkshopFilesSectionProps) {
  const [files, setFiles] = useState<WorkshopFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const supabase = createClient<Database>();
        const { data, error } = await supabase
          .from('workshop_files')
          .select('*')
          .eq('workshop_id', workshopId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching workshop files:', error);
          return;
        }

        setFiles(data || []);
      } catch (err) {
        console.error('Error fetching files:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchFiles();
  }, [workshopId]);

  const handleEditFile = (fileId: string) => {
    setEditingFileId(fileId);
  };

  const handleSaveFile = (updatedFile: WorkshopFile) => {
    setFiles(prevFiles => prevFiles.map(file => file.id === updatedFile.id ? updatedFile : file));
    setEditingFileId(null);
  };

  const handleCancelEdit = () => {
    setEditingFileId(null);
  };

  const handleDeleteFile = async (fileId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this file? This action cannot be undone.');

    if (!confirmDelete) {
      return;
    }

    setDeletingFileId(fileId);

    try {
      const supabase = createClient<Database>();

      // First, get the file details to delete from storage
      const { data: fileData, error: fetchError } = await supabase
        .from('workshop_files')
        .select('file_path')
        .eq('id', fileId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Delete from storage if file_path exists
      if (fileData?.file_path) {
        const { error: storageError } = await supabase.storage
          .from('workshops')
          .remove([fileData.file_path]);

        if (storageError) {
          console.warn('Error deleting file from storage:', storageError);
          // Continue with database deletion even if storage deletion fails
        }
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('workshop_files')
        .delete()
        .eq('id', fileId);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
      toast.success('File deleted successfully');
    } catch (err) {
      console.error('Error deleting file:', err);
      toast.error('Failed to delete file');
    } finally {
      setDeletingFileId(null);
    }
  };

  const refreshFiles = () => {
    setShowAddFileForm(false);
    // Refetch files
    const fetchFiles = async () => {
      try {
        const supabase = createClient<Database>();
        const { data, error } = await supabase
          .from('workshop_files')
          .select('*')
          .eq('workshop_id', workshopId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching workshop files:', error);
          return;
        }

        setFiles(data || []);
      } catch (err) {
        console.error('Error fetching files:', err);
      }
    };

    void fetchFiles();
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Workshop Files ({files.length})
        </h2>
        <button
          onClick={() => setShowAddFileForm(!showAddFileForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add File
        </button>
      </div>

      {showAddFileForm && workshop && (
        <div className="border-t pt-4 mb-6">
          <FileUploadForm
            workshopId={workshopId}
            folderPath={workshop.folder_path || 'default'}
            onSuccess={refreshFiles}
            onCancel={() => setShowAddFileForm(false)}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <DocumentIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>No files in this workshop yet.</p>
          <p className="text-sm">Click "Add File" to upload your first file.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.id}>
              {editingFileId === file.id ? (
                <WorkshopFileEditForm
                  file={file}
                  onSave={handleSaveFile}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <WorkshopFileItem
                  file={file}
                  onEdit={handleEditFile}
                  onDelete={(fileId) => void handleDeleteFile(fileId)}
                  isDeleting={deletingFileId === file.id}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}