import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import Image from 'next/image';

// Simple Skeleton component for loading state
const NavItemSkeleton = () => (
  <li className="animate-pulse">
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-200">
      <div className="h-5 w-5 bg-gray-300 rounded"></div>
      <div className="h-4 w-32 bg-gray-300 rounded"></div>
    </div>
  </li>
);

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, loading } = useAuth();

  // Dynamically determine the base path prefix based on the user's role
  const basePath = useMemo(() => {
    if (!profile?.role) return '/dashboard'; // Default or loading state
    switch (profile.role) {
      case 'admin':
        return '/dashboard/admin';
      case 'formator':
        return '/dashboard/formant'; // Use 'formant' path for 'formator' role
      case 'formee':
        return '/dashboard/formee';
      default:
        return '/dashboard'; // Fallback
    }
  }, [profile?.role]);

  // Define base nav items - Updated roles and dynamic paths
  const allNavItems = useMemo(() => [
    // Items visible to all roles (adjust paths)
    { name: 'Dashboard', path: `${basePath}`, icon: HomeIcon, roles: ['admin', 'formator', 'formee'] },
    { name: 'Folders', path: `${basePath}/folders`, icon: FolderIcon, roles: ['admin', 'formator', 'formee'] },
    { name: 'Common Syllabus', path: `${basePath}/documents/syllabus`, icon: DocumentTextIcon, roles: ['admin', 'formator', 'formee'] },
    { name: 'Workshops', path: `${basePath}/workshops`, icon: AcademicCapIcon, roles: ['admin', 'formator', 'formee'] },
    { name: 'Formation Personnel', path: `${basePath}/personnel`, icon: UserGroupIcon, roles: ['admin', 'formator', 'formee'] },

    // Items visible only to admin and formator
    { name: 'Users', path: `${basePath}/users`, icon: UsersIcon, roles: ['admin', 'formator'] },
    { name: 'Administration', path: `${basePath}/admin`, icon: Cog6ToothIcon, roles: ['admin', 'formator'] },

  ], [basePath]); // Depend on basePath

  // Filter nav items based on role AFTER loading is complete and profile exists
  const navItems = useMemo(() => {
    if (loading || !profile?.role) {
      return []; // Return empty array while loading or if role is unavailable
    }
    return allNavItems.filter(item => item.roles.includes(profile.role as string));
  }, [loading, profile, allNavItems]);

  return (
    <div className="h-full min-h-screen bg-white shadow-sm border-r border-gray-100 flex flex-col">
      <div className="px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/oblate-logo.svg"
            alt="Oblate Logo"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
          <span className="text-base font-medium text-gray-700">
            Formation desalesoblates
          </span>
        </Link>
      </div>
      {/* Separator - Remove padding from container */}
      <div>
         <div className="h-px w-full bg-gray-100"></div>
      </div>

      <nav className="flex-1 px-3 pb-6 mt-6">
        <ul className="space-y-1.5">
          {loading ? (
            // Show skeletons while loading
            <>
              <NavItemSkeleton />
              <NavItemSkeleton />
              <NavItemSkeleton />
              <NavItemSkeleton />
              <NavItemSkeleton />
            </>
          ) : (
            // Render filtered items after loading
            navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all duration-200 ${
                      isActive
                        ? 'bg-accent-primary/10 text-accent-primary font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-accent-primary' : 'text-gray-700'}`} />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })
          )}
          {!loading && navItems.length === 0 && profile && (
             // Optional: Show message if no items are visible for the user's role
            <li className="px-4 py-3 text-sm text-gray-500">No sections available for your role.</li>
          )}
           {!loading && !profile && (
             // Optional: Show message if profile couldn't be loaded
            <li className="px-4 py-3 text-sm text-red-500">Could not load user profile.</li>
          )}
        </ul>
      </nav>

      <div className="mt-auto p-4 mx-3 mb-6 rounded-xl bg-accent-secondary/5 border border-accent-secondary/10">
        <div className="flex flex-col space-y-2">
          <p className="text-xs font-medium text-text-secondary">Need help?</p>
          <Link
            href="/dashboard/help"
            className="text-sm font-medium text-accent-primary hover:text-accent-secondary transition-colors"
          >
            Visit our help center
          </Link>
        </div>
      </div>
    </div>
  );
}