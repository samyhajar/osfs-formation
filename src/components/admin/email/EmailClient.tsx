'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/browser-client';
import { Database } from '@/types/supabase';
import { Document, User, DocumentFilters } from './types';
import { DocumentsTable } from './DocumentsTable';
import { UsersTable } from './UsersTable';
import { WorkflowSteps } from './WorkflowSteps';
import { useEmailNotifications } from './useEmailNotifications';

export default function EmailClient() {
  const supabase = createClient();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [documentsConfirmed, setDocumentsConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentDocumentPage, setCurrentDocumentPage] = useState(1);

  // Document filters state
  const [documentFilters, setDocumentFilters] = useState<DocumentFilters>({
    category: '',
    language: '',
    keywords: ''
  });

  // Use the email notifications hook
  const { sendingEmails, successMessage, errorMessage, sendEmailNotifications } = useEmailNotifications({
    selectedDocumentIds,
    selectedUserIds,
    onSuccess: () => {
      // Reset selections after successful sending
      setTimeout(() => {
        setSelectedUserIds([]);
        resetDocumentSelection();
      }, 3000);
    }
  });

  // Fetch documents
  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true);
        let query = supabase
          .from('documents')
          .select('id, title, category, file_type, language, region, created_at, author_name')
          .order('created_at', { ascending: false });

        // Apply filters
        if (documentFilters.category) {
          query = query.eq('category', documentFilters.category);
        }

        if (documentFilters.language) {
          query = query.eq('language', documentFilters.language);
        }

        if (documentFilters.keywords) {
          query = query.or(`title.ilike.%${documentFilters.keywords}%,description.ilike.%${documentFilters.keywords}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching documents:', error);
          return;
        }

        setDocuments(data || []);
      } catch (error) {
        console.error('Error in fetchDocuments:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchDocuments();
  }, [supabase, documentFilters]);

  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);

        let query = supabase.from('profiles').select('id, name, email, role, status');

        // Apply status filter if selected
        if (statusFilter) {
          query = query.eq('status', statusFilter as Database['public']['Enums']['formee_status']);
        }

        const { data, error } = await query.order('name');

        if (error) {
          console.error('Error fetching users:', error);
          return;
        }

        // Check if data is an array and use a safer type cast
        if (Array.isArray(data)) {
          setUsers(data as unknown as User[]);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error in fetchUsers:', error);
      } finally {
        setLoading(false);
      }
    }

    void fetchUsers();
  }, [supabase, statusFilter]);

  // Toggle document selection
  const toggleDocumentSelection = (documentId: string) => {
    if (!documentsConfirmed) {
      setSelectedDocumentIds(prevSelected =>
        prevSelected.includes(documentId)
          ? prevSelected.filter(id => id !== documentId)
          : [...prevSelected, documentId]
      );
    }
  };

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prevSelected =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  // Confirm document selection
  const confirmDocumentSelection = () => {
    if (selectedDocumentIds.length > 0) {
      setDocumentsConfirmed(true);
    }
  };

  // Reset document selection
  const resetDocumentSelection = (clearSelection = true) => {
    if (clearSelection) {
      setSelectedDocumentIds([]);
    }
    setDocumentsConfirmed(false);
  };

  // Handle document filter changes
  const handleFilterChange = (newFilters: Partial<DocumentFilters>) => {
    setDocumentFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentDocumentPage(1); // Reset to first page when filters change
  };

  const handleSendEmails = (e: React.MouseEvent) => {
    e.preventDefault();
    void sendEmailNotifications();
  };

  return (
    <div className="space-y-6">
      {/* Workflow Steps */}
      <WorkflowSteps
        documentsConfirmed={documentsConfirmed}
        selectedUserIds={selectedUserIds}
        selectedDocumentIds={selectedDocumentIds}
      />

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Documents Section */}
        <DocumentsTable
          documents={documents}
          selectedDocumentIds={selectedDocumentIds}
          toggleDocumentSelection={toggleDocumentSelection}
          documentsConfirmed={documentsConfirmed}
          loading={loading}
          currentDocumentPage={currentDocumentPage}
          setCurrentDocumentPage={setCurrentDocumentPage}
          documentFilters={documentFilters}
          handleFilterChange={handleFilterChange}
          confirmDocumentSelection={confirmDocumentSelection}
          resetDocumentSelection={resetDocumentSelection}
        />

        {/* Users Section - Only show if documents are confirmed */}
        <UsersTable
          users={users}
          selectedUserIds={selectedUserIds}
          toggleUserSelection={toggleUserSelection}
          documentsConfirmed={documentsConfirmed}
          loading={loading}
          sendingEmails={sendingEmails}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          successMessage={successMessage}
          errorMessage={errorMessage}
          handleSendEmails={handleSendEmails}
        />
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}