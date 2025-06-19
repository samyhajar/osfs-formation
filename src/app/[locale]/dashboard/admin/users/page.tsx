import { createClient } from '@/lib/supabase/server-client';
// import { redirect } from 'next/navigation'; // Keep if other redirects are needed, but not for auth
import UserManagementClient from '@/components/admin/users/UserManagementClient';
import { getTranslations } from 'next-intl/server';

// Removed dynamic export
// export const dynamic = 'force-dynamic';

// Define default pagination parameters
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const t = await getTranslations('AdminUsersPage');

  // Get current page from search params
  const resolvedSearchParams = await searchParams;
  const currentPage = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : DEFAULT_PAGE;
  const limit = DEFAULT_LIMIT;

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

  // Calculate pagination
  const from = (currentPage - 1) * limit;
  const to = from + limit - 1;

  // Fetch all users with pagination
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, name, email, role, created_at, avatar_url, approval_date, is_approved, status')
    .range(from, to)
    .order('created_at', { ascending: false });

  // Get total count
  const { count: totalCount, error: countError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  if (usersError || countError) {
    console.error('Error fetching users or count:', usersError, countError);
    return <div className="p-6">{t('errorLoading')}</div>;
  }

  const allUsers = users ?? [];

  return (
    <UserManagementClient
      initialUsers={allUsers}
      totalCount={totalCount ?? 0}
      currentPage={currentPage}
      limit={limit}
    />
  );
}