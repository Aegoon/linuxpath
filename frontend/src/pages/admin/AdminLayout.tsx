import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Overview', path: '/admin' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Courses', path: '/admin/courses' },
  { label: 'Revenue', path: '/admin/revenue' },
  { label: 'Containers', path: '/admin/containers' },
  { label: 'Settings', path: '/admin/settings' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen bg-black">
      <aside className="w-52 border-r border-gray-800 p-4">
        <div className="text-white font-semibold mb-6 text-sm">LinuxPath Admin</div>
        <nav className="space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded text-sm transition-colors ${
                pathname === item.path
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 text-white">{children}</main>
    </div>
  );
}
