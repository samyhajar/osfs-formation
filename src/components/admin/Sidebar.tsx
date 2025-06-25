'use client'; // Sidebar needs to be a client component for hooks

// Import the Link component from next-intl navigation setup
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  FolderIcon,
  UserPlusIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl'; // Import useTranslations
import usePendingApprovals from '@/hooks/usePendingApprovals';

// Add a proper role type at the top of the file
type UserRole = 'admin' | 'editor' | 'user' | 'formator' | 'formee';

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
  const pathname = usePathname(); // Still use next/navigation usePathname for checks
  const { profile, loading } = useAuth();
  const t = useTranslations('Sidebar'); // Initialize translations
  const { count: pendingCount } = usePendingApprovals();

  // Dynamically determine the base path prefix based on the user's role
  const basePath = useMemo(() => {
    // Base path should NOT include locale for next-intl Link component
    if (!profile?.role) return '/dashboard'; // Default or loading state

    const role = profile.role as UserRole;

    switch (role) {
      case 'admin':
        return '/dashboard/admin';
      case 'editor':
        return '/dashboard/editor';
      case 'user':
        return '/dashboard/user';
      case 'formator': // Keep backward compatibility
        return '/dashboard/editor';
      case 'formee': // Keep backward compatibility
        return '/dashboard/user';
      default:
        return '/dashboard'; // Fallback
    }
  }, [profile?.role]);

    // Define base nav items - Use translation keys for names
  const allNavItems = useMemo(() => {
    const role = profile?.role as UserRole;
    let effectiveRole = role;
    if (role === 'formator') effectiveRole = 'editor';
    if (role === 'formee') effectiveRole = 'user';

    // Build navigation items in the correct order
    const navItems = [];

    // 1. Dashboard (always first)
    navItems.push({ nameKey: 'dashboard', path: `${basePath}`, icon: HomeIcon, roles: ['admin', 'editor', 'user'] });

    // 2. Role-specific navigation items (Documents for users, Folders for admin/editor)
    if (effectiveRole === 'user') {
      // For users: show "Documents" link that goes to the documents page
      navItems.push({ nameKey: 'documents', path: `${basePath}/documents`, icon: DocumentTextIcon, roles: ['user'] });
    } else {
      // For admin and editor: show "Folders" link
      navItems.push({ nameKey: 'folders', path: `${basePath}/folders`, icon: FolderIcon, roles: ['admin', 'editor'] });
    }

    // 3. Common navigation items (in order)
    navItems.push(
      { nameKey: 'commonSyllabus', path: `${basePath}/documents/syllabus`, icon: DocumentTextIcon, roles: ['admin', 'editor', 'user'] },
      { nameKey: 'workshops', path: `${basePath}/workshops`, icon: AcademicCapIcon, roles: ['admin', 'editor', 'user'] },
      { nameKey: 'formationPersonnel', path: `${basePath}/formation-personnel`, icon: UserGroupIcon, roles: ['admin', 'editor', 'user'] },
      { nameKey: 'confreresInFormation', path: `${basePath}/confreres-in-formation`, icon: UserGroupIcon, roles: ['admin', 'editor', 'user'] }
    );

    // 4. Admin/Editor specific items
    navItems.push({ nameKey: 'users', path: `${basePath}/users`, icon: UsersIcon, roles: ['admin', 'editor'] });

    // 5. Admin only items
    navItems.push(
      { nameKey: 'administration', path: `${basePath}/admin`, icon: Cog6ToothIcon, roles: ['admin'] },
      { nameKey: 'pendingUsers', path: `${basePath}/pending-users`, icon: UserPlusIcon, roles: ['admin'] },
      { nameKey: 'email', path: `${basePath}/email`, icon: EnvelopeIcon, roles: ['admin'] }
    );

    return navItems;
  }, [basePath, profile?.role]); // Depend on basePath

  // Filter nav items based on role AFTER loading is complete and profile exists
  const navItems = useMemo(() => {
    if (loading || !profile?.role) {
      return []; // Return empty array while loading or if role is unavailable
    }
    // Use the pathname from next/navigation which includes the locale prefix for isActive check
    const currentPathWithoutLocale = (pathname ?? '').replace(/^\/(en|fr)/, '') || '/';

    // Map old role names to new ones for compatibility
    const role = profile.role as UserRole;
    let effectiveRole = role;
    if (role === 'formator') effectiveRole = 'editor';
    if (role === 'formee') effectiveRole = 'user';

    return allNavItems
      .filter(item => item.roles.includes(effectiveRole as string))
      .map(item => ({
        ...item,
        // isActive check compares the item's path (without locale)
        // to the current browser path (also stripped of locale)
        isActive: currentPathWithoutLocale === item.path
      }));

  }, [loading, profile, allNavItems, pathname]);

  return (
    <div className="h-full min-h-screen bg-white shadow-sm border-r border-gray-100 flex flex-col">
      <div className="px-6 py-4">
        {/* This root link might need special handling if it should always go to default locale root */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/oblate-logo.svg"
            alt="Oblate Logo"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          {/* Keep title potentially hardcoded or move to a generic namespace if needed */}
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
              // const isActive = pathname === item.path; // Original isActive check won't work
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  {/* Use the Link from @/i18n/navigation */}
                  <Link
                    href={item.path} // Pass path WITHOUT locale prefix
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all duration-200 ${
                      item.isActive // Use pre-calculated isActive flag
                        ? 'bg-accent-primary/10 text-accent-primary font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${item.isActive ? 'text-accent-primary' : 'text-gray-700'}`} />
                    {/* Use translation function t() with the nameKey */}
                    <span>{t(item.nameKey)}</span>
                    {/* Badge for pending approvals – positioned before label */}
                    {item.nameKey === 'pendingUsers' && pendingCount > 0 && (
                      <span
                        className="ml-1 mr-2 inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-semibold leading-none text-red-800 bg-red-100 rounded-full ring-1 ring-red-300"
                        aria-label={`${pendingCount} ${t('pendingApprovals')}`}
                      >
                        {pendingCount > 99 ? '99+' : pendingCount}
                      </span>
                    )}
                    {/* Active indicator */}
                    {item.isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-primary" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })
          )}
          {!loading && navItems.length === 0 && profile && (
             // Optional: Show message if no items are visible for the user's role
            <li className="px-4 py-3 text-sm text-gray-500">{t('noSections')}</li>
          )}
           {!loading && !profile && (
             // Optional: Show message if profile couldn't be loaded
            <li className="px-4 py-3 text-sm text-red-500">{t('profileLoadError')}</li>
          )}
        </ul>
      </nav>
    </div>
  );
}