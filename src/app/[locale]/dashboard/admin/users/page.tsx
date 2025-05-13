import { createClient } from '@/lib/supabase/server-client';
// import { redirect } from 'next/navigation'; // Keep if other redirects are needed, but not for auth
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

  // Middleware should handle the primary auth & admin role check.
  // This page can assume it's only reached if the user is an authenticated admin.
  // We might still fetch user data if needed for page content, but redirects here can be removed.
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

  if (getUserError || !user) {
    // If middleware failed or there's an unexpected issue getting user here,
    // it's an error state. Middleware should have redirected to /login.
    // Logging an error here is useful.
    console.error('AdminUsersPage: Failed to get user or no user found, despite middleware checks. Error:', getUserError);
    // Instead of redirecting from here, let middleware handle it or show an error message.
    // For now, we'll fall through to data fetching; if RLS is set up, it should block data too.
    // Consider returning an error component if this state is reached.
    return <div className="p-6">{t('errorAccessingUser')}</div>; // Or a more specific error
  }

  // Optionally, a less aggressive check for admin role if needed, or trust middleware
  // const { data: profile, error: profileError } = await supabase
  //   .from('profiles')
  //   .select('role')
  //   .eq('id', user.id)
  //   .single();
  // if (profileError || !profile || profile.role !== 'admin') {
  //   console.error('AdminUsersPage: User is not an admin or profile error. Error:', profileError);
  //   return <div className="p-6">{t('errorNotAdmin')}</div>;
  // }

  // Fetch data (assuming user is an admin at this point)
  const limit = DEFAULT_LIMIT;
  const formatorPage = DEFAULT_PAGE;
  const formeePage = DEFAULT_PAGE;

  const formatorFrom = (formatorPage - 1) * limit;
  const formatorTo = formatorFrom + limit - 1;

  const formeeFrom = (formeePage - 1) * limit;
  const formeeTo = formeeFrom + limit - 1;

  const { data: formators, error: formatorsError } = await supabase
    .from('profiles')
    .select('id, name, email, role, created_at, avatar_url, approval_date, is_approved, status')
    .eq('role', 'editor') // Assuming 'editor' is your formator role
    .range(formatorFrom, formatorTo)
    .order('created_at', { ascending: false });

  const { count: formatorCount, error: formatorCountError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'editor');

  const { data: formees, error: formeesError } = await supabase
    .from('profiles')
    .select('id, name, email, role, created_at, avatar_url, approval_date, is_approved, status')
    .eq('role', 'user') // Assuming 'user' is your formee role
    .range(formeeFrom, formeeTo)
    .order('created_at', { ascending: false });

  const { count: formeeCount, error: formeeCountError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'user');

  if (formatorsError || formeesError || formatorCountError || formeeCountError) {
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