import { createClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';
import UserManagementClient from '@/components/formee/users/UserManagementClient';
import { Database } from '@/types/supabase';

// Define default pagination parameters
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export default async function FormeeUsersPage() {
  const supabase = await createClient<Database>();

  // 1. Check if user is logged in and is a formee
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Ensure user is a formee for this page
  if (profileError || !profile || profile.role !== 'formee') {
    console.error('Access denied or profile fetch error:', profileError);
    redirect('/dashboard');
  }

  // Hardcode fetching first page
  const limit = DEFAULT_LIMIT;
  const formatorPage = DEFAULT_PAGE;
  const formeePage = DEFAULT_PAGE;

  const formatorFrom = (formatorPage - 1) * limit;
  const formatorTo = formatorFrom + limit - 1;

  const formeeFrom = (formeePage - 1) * limit;
  const formeeTo = formeeFrom + limit - 1;

  // 2. Fetch Formators (paginated) and total count
  const { data: formators, error: formatorsError } = await supabase
    .from('profiles')
    .select('id, name, email, role, created_at, avatar_url')
    .eq('role', 'formator')
    .range(formatorFrom, formatorTo)
    .order('created_at', { ascending: false });

  const { count: formatorCount, error: formatorCountError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'formator');

  // 3. Fetch Formees (paginated) and total count
  const { data: formees, error: formeesError } = await supabase
    .from('profiles')
    .select('id, name, email, role, created_at, avatar_url')
    .eq('role', 'formee')
    .range(formeeFrom, formeeTo)
    .order('created_at', { ascending: false });

  const { count: formeeCount, error: formeeCountError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'formee');

  if (formatorsError || formeesError || formatorCountError || formeeCountError) {
    console.error(
      'Error fetching users or counts:',
      formatorsError,
      formeesError,
      formatorCountError,
      formeeCountError
    );
    return <div className="p-6">Error loading user data. Please try again later.</div>;
  }

  // Ensure data is not null, default to empty array if null
  const formatorUsers = formators ?? [];
  const formeeUsers = formees ?? [];

  return (
    <UserManagementClient
      initialFormatorUsers={formatorUsers}
      initialFormeeUsers={formeeUsers}
      formatorCount={formatorCount ?? 0}
      formeeCount={formeeCount ?? 0}
      currentPageFormator={formatorPage}
      currentPageFormee={formeePage}
      limit={limit}
    />
  );
}