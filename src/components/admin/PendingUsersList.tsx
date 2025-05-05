'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PendingUsersTable from './PendingUsersTable';

interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  role: 'admin' | 'formator' | 'formee';
  is_approved: boolean;
  created_at: string;
  avatar_url: string | null;
}

interface ApiResponse {
  error?: string;
  success?: boolean;
  message?: string;
}

export default function PendingUsersList() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { supabase } = useAuth();

  // Fetch all pending users
  const fetchPendingUsers = useCallback(async () => {
    if (!supabase) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data as Profile[]);
    } catch (err) {
      console.error('Error fetching pending users:', err);
      setError('Failed to load pending users');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Approve a user and set their role
  const approveUser = async (userId: string, role: 'admin' | 'formator' | 'formee') => {
    if (!supabase) return;

    try {
      setActionInProgress(userId);
      setSuccessMessage(null);
      setError(null);

      // Find the user's email
      const userEmail = users.find(u => u.id === userId)?.email;

      if (!userEmail) {
        throw new Error('User email not found');
      }

      // Update profile with approval status and role
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_approved: true,
          approval_date: new Date().toISOString(),
          role: role
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Send confirmation email through API route
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error('No active session');
      }

      // Use absolute URL to bypass next-intl middleware
      const response = await fetch(`${window.location.origin}/api/send-approval-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session.access_token}`
        },
        body: JSON.stringify({
          user_id: userId,
          email: userEmail
        }),
      });

      const result = await response.json() as ApiResponse;

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send approval email');
      }

      // Remove the approved user from the list
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setSuccessMessage('User approved and confirmation email sent successfully');

      // Refresh the list
      void fetchPendingUsers();
    } catch (err) {
      console.error('Error approving user:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve user');
    } finally {
      setActionInProgress(null);
    }
  };

  // Delete a user (reject application)
  const deleteUser = async (userId: string) => {
    if (!supabase) return;

    if (!window.confirm('Are you sure you want to reject this user? This action cannot be undone.')) {
      return;
    }

    try {
      setActionInProgress(userId);
      setSuccessMessage(null);
      setError(null);

      // Get the session for authentication
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        throw new Error('No active session');
      }

      // Use absolute URL to bypass next-intl middleware
      const response = await fetch(`${window.location.origin}/api/delete-pending-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionData.session.access_token}`
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        const result = await response.json() as ApiResponse;
        throw new Error(result.error || 'Failed to delete user');
      }

      // Remove the deleted user from the list
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setSuccessMessage('User application rejected successfully');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to reject user');
    } finally {
      setActionInProgress(null);
    }
  };

  useEffect(() => {
    void fetchPendingUsers();
  }, [fetchPendingUsers]);

  return (
    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Pending User Approvals</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-slate-500">
          <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading pending users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="py-8 text-center text-slate-500 border border-dashed border-slate-200 rounded-md">
          <p>No pending user approvals</p>
        </div>
      ) : (
        <PendingUsersTable
          users={users}
          actionInProgress={actionInProgress}
          onApprove={approveUser}
          onReject={deleteUser}
        />
      )}
    </div>
  );
}