import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { Document } from '@/types/document';

type SetErrorFunction = (error: string | null) => void;

export function useDocumentDeletion(
  documents: Document[],
  setError: SetErrorFunction,
) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null,
  );

  const handleDeleteDocument = (id: string) => {
    try {
      const docToDelete = documents.find((doc) => doc.id === id);
      if (!docToDelete) {
        setError(`Document with ID ${id} not found.`);
        return;
      }

      setDocumentToDelete(docToDelete);
    } catch (err: unknown) {
      console.error('Error preparing document for deletion:', err);
      setError(
        `Error preparing document for deletion: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  };

  const confirmDeleteDocument = () => {
    if (!documentToDelete) return;

    setIsDeleting(true);
    setError(null);

    const deleteDocument = async () => {
      try {
        const supabase = createClient<Database>();

        // Delete document record from the database
        const { error: deleteDbError } = await supabase
          .from('documents')
          .delete()
          .eq('id', documentToDelete.id);

        if (deleteDbError) {
          if (deleteDbError.message.includes('permission denied')) {
            throw new Error(
              `You do not have permission to delete this document.`,
            );
          } else {
            throw deleteDbError;
          }
        }

        // If there's content_url, try to delete from storage
        if (documentToDelete.content_url) {
          try {
            // Extract file path from content_url if it's a storage URL
            const storagePath = documentToDelete.content_url
              .split('/')
              .slice(-2)
              .join('/');

            const { error: deleteStorageError } = await supabase.storage
              .from('documents')
              .remove([storagePath]);

            if (
              deleteStorageError &&
              !deleteStorageError.message.includes('Object not found')
            ) {
              console.error(
                'Failed to delete file from storage:',
                deleteStorageError,
              );
            }
          } catch (storageErr) {
            // Log but don't fail the whole operation if storage deletion fails
            console.error('Error deleting file from storage:', storageErr);
          }
        }

        setDocumentToDelete(null);
      } catch (err: unknown) {
        console.error('Error deleting document:', err);
        setError(
          `Error deleting document: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      } finally {
        setIsDeleting(false);
      }
    };

    void deleteDocument();
  };

  const cancelDelete = () => {
    setDocumentToDelete(null);
  };

  return {
    documentToDelete,
    isDeleting,
    handleDeleteDocument,
    confirmDeleteDocument,
    cancelDelete,
  };
}
