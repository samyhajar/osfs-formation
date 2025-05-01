import { createClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';
import FormatorUserTable from '@/components/dashboard/admin/users/FormatorUserTable';
import FormeeUserTable from '@/components/dashboard/admin/users/FormeeUserTable';
import { Database } from '@/types/supabase'; // Assuming you have this generated type

export default async function AdminUsersPage() {
  const supabase = await createClient<Database>();

  // 1. Check if user is logged in and is an admin
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login'); // Or your login page
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    // Or redirect to a general dashboard / show an unauthorized message
    console.error('Access denied or profile fetch error:', profileError);
    redirect('/dashboard');
  }

  // 2. Fetch Formators
  const { data: formators, error: formatorsError } = await supabase
    .from('profiles')
    .select('id, name, email, role, avatar_url, created_at') // Select all needed columns
    .eq('role', 'formator');

  // 3. Fetch Formees
  const { data: formees, error: formeesError } = await supabase
    .from('profiles')
    .select('id, name, email, role, avatar_url, created_at') // Select all needed columns
    .eq('role', 'formee'); // This should now be valid after type generation

  if (formatorsError || formeesError) {
    console.error('Error fetching users:', formatorsError, formeesError);
    // Handle error display appropriately - maybe show an error message component
    return <div>Error loading user data.</div>;
  }

  // Ensure data is not null, default to empty array if null
  const formatorUsers = formators ?? [];
  const formeeUsers = formees ?? [];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">User Management</h1>
        <p className="text-gray-500 mt-1">Manage formator and formee user accounts.</p>
      </div>

      {/* Formator Users Card */}
      <FormatorUserTable users={formatorUsers} />

      {/* Formee Users Card */}
      <FormeeUserTable users={formeeUsers} />
    </div>
  );
}