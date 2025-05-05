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
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl'; // Import useTranslations

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

  // Dynamically determine the base path prefix based on the user's role
  const basePath = useMemo(() => {
    // Base path should NOT include locale for next-intl Link component
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

  // Define base nav items - Use translation keys for names
  const allNavItems = useMemo(() => [
    // Items visible to all roles (adjust paths)
    { nameKey: 'dashboard', path: `${basePath}`, icon: HomeIcon, roles: ['admin', 'formator', 'formee'] },
    { nameKey: 'folders', path: `${basePath}/folders`, icon: FolderIcon, roles: ['admin', 'formator', 'formee'] },
    { nameKey: 'commonSyllabus', path: `${basePath}/documents/syllabus`, icon: DocumentTextIcon, roles: ['admin', 'formator', 'formee'] },
    { nameKey: 'workshops', path: `${basePath}/workshops`, icon: AcademicCapIcon, roles: ['admin', 'formator', 'formee'] },
    { nameKey: 'formationPersonnel', path: `${basePath}/formation-personnel`, icon: UserGroupIcon, roles: ['admin', 'formator', 'formee'] },

    // Items visible only to admin and formator
    { nameKey: 'users', path: `${basePath}/users`, icon: UsersIcon, roles: ['admin', 'formator'] },
    { nameKey: 'administration', path: `${basePath}/admin`, icon: Cog6ToothIcon, roles: ['admin', 'formator'] },

  ], [basePath]); // Depend on basePath

  // Filter nav items based on role AFTER loading is complete and profile exists
  const navItems = useMemo(() => {
    if (loading || !profile?.role) {
      return []; // Return empty array while loading or if role is unavailable
    }
    // Use the pathname from next/navigation which includes the locale prefix for isActive check
    const currentPathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/';

    return allNavItems
      .filter(item => item.roles.includes(profile.role as string))
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

      {/* Use translations for help section */}
      <div className="mt-auto p-4 mx-3 mb-6 rounded-xl bg-accent-secondary/5 border border-accent-secondary/10">
        <div className="flex flex-col space-y-2">
          <p className="text-xs font-medium text-text-secondary">{t('needHelp')}</p>
          {/* Use the next-intl Link for this as well */}
          <Link
            href="/dashboard/help" // Path without locale
            className="text-sm font-medium text-accent-primary hover:text-accent-secondary transition-colors"
          >
            {t('helpCenterLink')}
          </Link>
        </div>
      </div>
    </div>
  );
}