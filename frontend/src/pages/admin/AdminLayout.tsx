import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  DollarSign, 
  Server, 
  Settings,
  Terminal,
  LogOut
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { group: 'Main', items: [
      { name: 'Overview', icon: <LayoutDashboard size={18} />, path: '/admin' },
      { name: 'Users', icon: <Users size={18} />, path: '/admin/users' },
      { name: 'Courses', icon: <BookOpen size={18} />, path: '/admin/courses' },
      { name: 'Revenue', icon: <DollarSign size={18} />, path: '/admin/revenue' },
    ]},
    { group: 'System', items: [
      { name: 'Containers', icon: <Server size={18} />, path: '/admin/containers' },
      { name: 'Settings', icon: <Settings size={18} />, path: '/admin/settings' },
    ]}
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#1A1A1A] text-white fixed h-full flex flex-col border-r border-gray-800">
        <div className="p-6 border-b border-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF5F1F] rounded flex items-center justify-center">
            <Terminal size={18} />
          </div>
          <span className="font-bold tracking-tight">Admin Console</span>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          {navItems.map((group, idx) => (
            <div key={idx} className="mb-8">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-4 px-2">
                {group.group}
              </h4>
              <div className="space-y-1">
                {group.items.map((item, i) => (
                  <Link
                    key={i}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path) 
                        ? 'bg-[#FF5F1F] text-white shadow-lg shadow-orange-950/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <LogOut size={18} />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-[220px] flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
