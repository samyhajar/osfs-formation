'use client';

interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  role: 'admin' | 'formator' | 'formee';
  is_approved: boolean;
  created_at: string;
  avatar_url: string | null;
}

interface PendingUsersTableProps {
  users: Profile[];
  actionInProgress: string | null;
  onApprove: (userId: string, role: 'admin' | 'formator' | 'formee') => Promise<void>;
  onReject: (userId: string) => Promise<void>;
}

export default function PendingUsersTable({
  users,
  actionInProgress,
  onApprove,
  onReject
}: PendingUsersTableProps) {
  const handleApprove = (userId: string) => {
    const select = document.getElementById(`role-${userId}`) as HTMLSelectElement;
    const role = select.value as 'admin' | 'formator' | 'formee';
    if (!role) {
      alert('Please select a role');
      return;
    }
    void onApprove(userId, role);
  };

  const handleReject = (userId: string) => {
    void onReject(userId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 text-left">
          <tr>
            <th className="px-4 py-3 text-sm font-medium text-slate-600">Name</th>
            <th className="px-4 py-3 text-sm font-medium text-slate-600">Email</th>
            <th className="px-4 py-3 text-sm font-medium text-slate-600">Signup Date</th>
            <th className="px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50">
              <td className="px-4 py-4 text-sm text-slate-800">{user.name || 'No name provided'}</td>
              <td className="px-4 py-4 text-sm text-slate-800">{user.email}</td>
              <td className="px-4 py-4 text-sm text-slate-800">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </td>
              <td className="px-4 py-4 text-sm">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-2">
                    <select
                      id={`role-${user.id}`}
                      defaultValue=""
                      className="text-xs px-2 py-1 border border-slate-300 rounded bg-white text-slate-800"
                      disabled={actionInProgress === user.id}
                    >
                      <option value="" disabled>Select role</option>
                      <option value="admin">Admin</option>
                      <option value="formator">Formator</option>
                      <option value="formee">Formee</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleApprove(user.id)}
                      disabled={actionInProgress === user.id}
                      className="text-xs px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      {actionInProgress === user.id ? 'Processing...' : 'Approve'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleReject(user.id)}
                    disabled={actionInProgress === user.id}
                    className="text-xs px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    {actionInProgress === user.id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}