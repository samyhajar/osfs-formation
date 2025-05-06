import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server-client';
import PendingUsersList from '@/components/admin/PendingUsersList';

export default async function PendingUsersPage() {
  // Check if the user is an admin
  const supabase = await createClient();

  // Use getUser() instead of getSession() for better security
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/');
  }

  // Get the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">User Management</h1>
      <PendingUsersList />
    </div>
  );
}