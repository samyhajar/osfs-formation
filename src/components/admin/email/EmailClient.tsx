'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/browser-client';
import DocumentsCard from './cards/DocumentsCard';
import UsersCard from './cards/UsersCard';
import StatusMessages from './cards/StatusMessages';

type Document = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  status?: string | null;
};

export default function EmailClient() {
  const t = useTranslations('EmailPage');
  const supabase = createClient();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [documentsConfirmed, setDocumentsConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch documents
  useEffect(() => {
    async function fetchDocuments() {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('id, title, category, created_at')
          .order('created_at', { ascending: false });

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
  }, [supabase]);

  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);

        let query = supabase.from('profiles').select('id, name, email, role, status');

        // Apply status filter if selected
        if (statusFilter) {
          query = query.eq('status', statusFilter);
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
  const resetDocumentSelection = () => {
    setSelectedDocumentIds([]);
    setDocumentsConfirmed(false);
  };

  // Send email notifications
  const sendEmailNotifications = async () => {
    if (selectedDocumentIds.length === 0 || selectedUserIds.length === 0) {
      return;
    }

    try {
      setSendingEmails(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Get the current locale from the URL path
      const locale = window.location.pathname.split('/')[1] || 'en';

      const response = await fetch(`/${locale}/api/send-document-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentIds: selectedDocumentIds,
          recipientIds: selectedUserIds,
        }),
      });

      const result = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email notifications');
      }

      setSuccessMessage(t('emailSuccess'));
      // Reset selections after successful sending
      setSelectedUserIds([]);
      resetDocumentSelection();
    } catch (error) {
      console.error('Error sending email notifications:', error);
      setErrorMessage(error instanceof Error ? error.message : t('emailError'));
    } finally {
      setSendingEmails(false);
    }
  };

  const handleSendEmails = (e: React.MouseEvent) => {
    e.preventDefault();
    void sendEmailNotifications();
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      {/* Documents Card */}
      <DocumentsCard
        documents={documents}
        loading={loading}
        selectedDocumentIds={selectedDocumentIds}
        documentsConfirmed={documentsConfirmed}
        toggleDocumentSelection={toggleDocumentSelection}
        confirmDocumentSelection={confirmDocumentSelection}
        resetDocumentSelection={resetDocumentSelection}
      />

      {/* Users Card */}
      <UsersCard
        users={users}
        loading={loading}
        selectedUserIds={selectedUserIds}
        documentsConfirmed={documentsConfirmed}
        statusFilter={statusFilter}
        sendingEmails={sendingEmails}
        toggleUserSelection={toggleUserSelection}
        setStatusFilter={setStatusFilter}
        onSendEmails={handleSendEmails}
      />

      {/* Status Messages */}
      <StatusMessages
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
    </div>
  );
}