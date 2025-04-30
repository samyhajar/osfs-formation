import { Database } from '@/types/supabase';
import { PlusIcon } from '@heroicons/react/24/outline';

// Define the type for a user profile row more explicitly
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface FormeeUserTableProps {
  users: ProfileRow[];
}

export default function FormeeUserTable({ users }: FormeeUserTableProps) {
  return (
    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Formees ({users.length})
        </h3>
         <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-accent-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-accent-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
        >
          <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Add Formee
        </button>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {/* Placeholder for the table */}
         {users.length > 0 ? (
           <div className="text-sm text-gray-500">Formee user table goes here...</div>
           // TODO: Implement actual table using user data
        ) : (
          <div className="text-sm text-gray-500 italic">No formees found.</div>
        )}
      </div>
    </div>
  );
}