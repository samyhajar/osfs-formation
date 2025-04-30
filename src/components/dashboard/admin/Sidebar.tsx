import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, MagnifyingGlassIcon, ClockIcon, DocumentTextIcon, AcademicCapIcon, UserGroupIcon, CogIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard/admin', icon: HomeIcon },
    { name: 'Recently uploaded', path: '/dashboard/admin/documents/recent', icon: ClockIcon },
    { name: 'Common Syllabus', path: '/dashboard/admin/documents/syllabus', icon: DocumentTextIcon },
    { name: 'Workshops', path: '/dashboard/admin/workshops', icon: AcademicCapIcon },
    { name: 'Formation Personnel', path: '/dashboard/admin/personnel', icon: UserGroupIcon },
    { name: 'Users', path: '/dashboard/admin/users', icon: UsersIcon },
    { name: 'Administration', path: '/dashboard/admin/admin', icon: CogIcon },
  ];

  return (
    <div className="h-full min-h-screen bg-white shadow-sm border-r border-gray-100 flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-accent-primary">Resources</h2>
      </div>

      <nav className="flex-1 px-3 pb-6">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
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
          })}
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