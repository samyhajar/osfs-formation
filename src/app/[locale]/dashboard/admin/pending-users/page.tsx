'use client';

import { useEffect } from 'react';
import PendingUsersList from '@/components/admin/PendingUsersList';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from '@/i18n/navigation';

export default function PendingUsersPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  // Redirect non-admins to dashboard
  useEffect(() => {
    if (!loading) {
      if (!profile || profile.role !== 'admin') {
        router.replace('/dashboard/admin');
      }
    }
  }, [loading, profile, router]);

  // Optionally show a loader while we verify role
  if (loading || !profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">User Management</h1>
      <PendingUsersList />
    </div>
  );
}

// Page needs to be dynamic to avoid static generation
export const dynamic = 'force-dynamic';