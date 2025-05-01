import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  ClockIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserGroupIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

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

  // Define base nav items - adjust role names if different
  const allNavItems = useMemo(() => [
    { name: 'Dashboard', path: '/dashboard/admin', icon: HomeIcon, roles: ['admin', 'user'] }, // Example: visible to all logged-in roles
    { name: 'Recently uploaded', path: '/dashboard/admin/documents/recent', icon: ClockIcon, roles: ['admin', 'user'] },
    { name: 'Common Syllabus', path: '/dashboard/admin/documents/syllabus', icon: DocumentTextIcon, roles: ['admin', 'user'] },
    { name: 'Workshops', path: '/dashboard/admin/workshops', icon: AcademicCapIcon, roles: ['admin', 'user'] },
    { name: 'Formation Personnel', path: '/dashboard/admin/personnel', icon: UserGroupIcon, roles: ['admin', 'user'] },
    { name: 'Users', path: '/dashboard/admin/users', icon: UsersIcon, roles: ['admin'] }, // Admin only
    { name: 'Administration', path: '/dashboard/admin/admin', icon: Cog6ToothIcon, roles: ['admin'] }, // Admin only
  ], []);

  // Filter nav items based on role AFTER loading is complete and profile exists
  const navItems = useMemo(() => {
    if (loading || !profile?.role) {
      return []; // Return empty array while loading or if role is unavailable
    }
    return allNavItems.filter(item => item.roles.includes(profile.role as string));
  }, [loading, profile, allNavItems]);

  return (
    <div className="h-full min-h-screen bg-white shadow-sm border-r border-gray-100 flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-accent-primary">Resources</h2>
      </div>

      <nav className="flex-1 px-3 pb-6">
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
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