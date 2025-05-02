import { createClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';
import UserManagementClient from '@/components/admin/users/UserManagementClient';
import { Database } from '@/types/supabase';

// Mark the page as dynamic because it uses searchParams
export const dynamic = 'force-dynamic';

// Define default pagination parameters
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20; // Fetch 20 users per page

type AdminUsersPageProps = {
  searchParams: {
    formatorPage?: string;
    formeePage?: string;
    limit?: string;
  };
};

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
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

  // Parse pagination parameters from URL, with defaults
  const limit = parseInt(searchParams.limit || '', 10) || DEFAULT_LIMIT;
  const formatorPage = parseInt(searchParams.formatorPage || '', 10) || DEFAULT_PAGE;
  const formeePage = parseInt(searchParams.formeePage || '', 10) || DEFAULT_PAGE;

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
    .order('created_at', { ascending: false }); // Example ordering

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
    .order('created_at', { ascending: false }); // Example ordering

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