import { createClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';
import UserManagementClient from '@/components/admin/users/UserManagementClient';
import { getTranslations } from 'next-intl/server';

// Removed dynamic export
// export const dynamic = 'force-dynamic';

// Define default pagination parameters (still used for fetching first page)
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

// Removed PageProps type definition and helpers

// Revert function signature to not destructure props (as they are not used for now)
export default async function AdminUsersPage() {
  const supabase = await createClient();
  const t = await getTranslations('AdminUsersPage');

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

  // Hardcode fetching first page (limit 20)
  const limit = DEFAULT_LIMIT;
  const formatorPage = DEFAULT_PAGE;
  const formeePage = DEFAULT_PAGE;

  const formatorFrom = (formatorPage - 1) * limit;
  const formatorTo = formatorFrom + limit - 1;

  const formeeFrom = (formeePage - 1) * limit;
  const formeeTo = formeeFrom + limit - 1;

  // Fetch data without using searchParams
  // (Rest of the data fetching logic remains the same, just uses hardcoded page/limit)
  // ... (fetch formators) ...
  const { data: formators, error: formatorsError } = await supabase
    .from('profiles')
    .select('id, name, email, role, created_at, avatar_url, approval_date, is_approved, status')
    .eq('role', 'formator')
    .range(formatorFrom, formatorTo)
    .order('created_at', { ascending: false });

  const { count: formatorCount, error: formatorCountError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'formator');

  // ... (fetch formees) ...
  const { data: formees, error: formeesError } = await supabase
    .from('profiles')
    .select('id, name, email, role, created_at, avatar_url, approval_date, is_approved, status')
    .eq('role', 'formee')
    .range(formeeFrom, formeeTo)
    .order('created_at', { ascending: false });

  const { count: formeeCount, error: formeeCountError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'formee');


  if (formatorsError || formeesError || formatorCountError || formeeCountError) {
    // ... (error handling) ...
    console.error(
      'Error fetching users or counts:',
      formatorsError,
      formeesError,
      formatorCountError,
      formeeCountError
    );
    return <div className="p-6">{t('errorLoading')}</div>;
  }

  const formatorUsers = formators ?? [];
  const formeeUsers = formees ?? [];

  // Pass hardcoded page/limit values to client component
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