import { createClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';
import UserManagementClient from '@/components/formant/users/UserManagementClient';
import { Database } from '@/types/supabase';

export default async function AdminUsersPage() {
  const supabase = await createClient<Database>();

  // 1. Check if user is logged in and is an admin
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    console.error('Access denied or profile fetch error:', profileError);
    redirect('/dashboard');
  }

  // 2. Fetch Formators
  const { data: formators, error: formatorsError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'formator');

  // 3. Fetch Formees
  const { data: formees, error: formeesError } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'formee');

  if (formatorsError || formeesError) {
    console.error('Error fetching users:', formatorsError, formeesError);
    return <div className="p-6">Error loading user data. Please try again later.</div>;
  }

  // Ensure data is not null, default to empty array if null
  const formatorUsers = formators ?? [];
  const formeeUsers = formees ?? [];

  return (
    <UserManagementClient
      initialFormatorUsers={formatorUsers}
      initialFormeeUsers={formeeUsers}
    />
  );
}