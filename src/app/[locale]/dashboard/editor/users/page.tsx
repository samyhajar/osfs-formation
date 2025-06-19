import { createClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';
import UserManagementClient from '@/components/editor/users/UserManagementClient';

// Define default pagination parameters
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export default async function EditorUsersPage() {
  const supabase = await createClient();

  // 1. Check if user is logged in and is an editor
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Ensure user is an editor for this page
  if (profileError || !profile || profile.role !== 'editor') {
    console.error('Access denied or profile fetch error:', profileError);
    redirect('/dashboard/editor'); // Redirect if not an editor
  }

  // Hardcode fetching first page
  const limit = DEFAULT_LIMIT;
  const editorPage = DEFAULT_PAGE;
  const userPage = DEFAULT_PAGE;

  const editorFrom = (editorPage - 1) * limit;
  const editorTo = editorFrom + limit - 1;

  const userFrom = (userPage - 1) * limit;
  const userTo = userFrom + limit - 1;

  // 2. Fetch Editors (paginated) and total count
  const { data: editors, error: editorsError } = await supabase
    .from('profiles')
    .select('id, name, email, role, created_at, avatar_url, approval_date, is_approved, status')
    .eq('role', 'editor')
    .range(editorFrom, editorTo)
    .order('created_at', { ascending: false });

  const { count: editorCount, error: editorCountError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'editor');

  // 3. Fetch Users (paginated) and total count
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, name, email, role, created_at, avatar_url, approval_date, is_approved, status')
    .eq('role', 'user')
    .range(userFrom, userTo)
    .order('created_at', { ascending: false });

  const { count: userCount, error: userCountError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('role', 'user');

  if (editorsError || usersError || editorCountError || userCountError) {
    console.error(
      'Error fetching users or counts:',
      editorsError,
      usersError,
      editorCountError,
      userCountError
    );
    return <div className="p-6">Error loading user data. Please try again later.</div>;
  }

  // Ensure data is not null, default to empty array if null
  const editorUsers = editors ?? [];
  const regularUsers = users ?? [];

  return (
    <UserManagementClient
      initialFormatorUsers={editorUsers}
      initialFormeeUsers={regularUsers}
      formatorCount={editorCount ?? 0}
      formeeCount={userCount ?? 0}
      currentPageFormator={editorPage}
      currentPageFormee={userPage}
      limit={limit}
    />
  );
}