import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Shield, 
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { UserSlideOver } from '../../components/admin/UserSlideOver';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/users?search=${search}&filter=${filter}`)
      .then(res => res.json())
      .then(setUsers);
  }, [search, filter]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-gray-500">Manage students and their accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F1F]/20 focus:border-[#FF5F1F] w-64"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-gray-200">
            {['All', 'Pro', 'Banned'].map(t => (
              <button 
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === t ? 'bg-[#1A1A1A] text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] uppercase font-bold tracking-widest text-gray-400">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Progress</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-all group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF5F1F] flex items-center justify-center font-black text-[10px]">
                      {user.avatarInitials || user.name?.substring(0,2).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-bold flex items-center gap-2">
                        {user.name || 'Anonymous User'}
                        {user.role === 'admin' && <Shield size={12} className="text-blue-500" />}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                  {user.levels[0]?.level.name || 'L1 Start'}
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '45%' }} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                    user.subscription?.status === 'active' 
                      ? 'bg-blue-50 text-blue-600 border-blue-100' 
                      : 'bg-gray-50 text-gray-400 border-gray-100'
                  }`}>
                    {user.subscription?.status === 'active' ? 'Pro' : 'Free'}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setSelectedUser(user.id)}
                    className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-[#1A1A1A] transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserSlideOver 
        userId={selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
    </div>
  );
}
