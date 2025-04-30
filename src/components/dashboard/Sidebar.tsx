import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Search Documents', path: '/dashboard/documents/search' },
    { name: 'Recently uploaded', path: '/dashboard/documents/recent' },
    { name: 'Common Syllabus', path: '/dashboard/documents/syllabus' },
    { name: 'Workshops', path: '/dashboard/workshops' },
    { name: 'Formation Personnel', path: '/dashboard/personnel' },
    { name: 'Administration', path: '/dashboard/admin' },
  ];

  return (
    <div className="bg-white w-64 h-full min-h-screen border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-black">Resources</h2>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block px-4 py-2 rounded-md text-sm ${
                    isActive
                      ? 'bg-gray-100 text-black font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}