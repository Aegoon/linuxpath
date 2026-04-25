import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

import { RevenueChart } from '../../components/admin/RevenueChart';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/overview')
      .then(res => res.json())
      .then(setStats);
  }, []);

  if (!stats) return null;

  const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = [120, 150, 450, 320, 500, 420, 600];

  const cards = [
    { name: 'Total Users', value: stats.metrics.totalUsers, change: `+${stats.metrics.usersThisWeek} this week`, icon: <Users />, color: 'bg-blue-500' },
    { name: 'MRR', value: `$${stats.metrics.mrr}`, change: '+12% last month', icon: <DollarSign />, color: 'bg-green-500' },
    { name: 'Pro Subscribers', value: stats.metrics.proSubscribers, change: '10% of total', icon: <TrendingUp />, color: 'bg-purple-500' },
    { name: 'Avg Completion', value: `${stats.metrics.completionRate}%`, change: '+3% improvement', icon: <CheckCircle2 />, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-gray-500">How LinuxPath is performing today.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${card.color} text-white rounded-lg flex items-center justify-center mb-4`}>
              {card.icon}
            </div>
            <div className="text-sm font-medium text-gray-500 mb-1">{card.name}</div>
            <div className="text-2xl font-black mb-1">{card.value}</div>
            <div className="text-[10px] font-bold text-green-600 flex items-center gap-1">
              <ArrowUpRight size={12} />
              {card.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-gray-100 min-h-[400px]">
          <h3 className="font-bold mb-6">Revenue Trend</h3>
          <div className="h-[250px]">
            <RevenueChart type="bar" data={chartData} labels={chartLabels} />
          </div>
          <div className="mt-8 flex gap-2">
            {['7d', '30d', '90d'].map(d => (
              <button key={d} className={`px-3 py-1 rounded-md text-xs font-bold ${d === '30d' ? 'bg-[#1A1A1A] text-white' : 'bg-gray-100 text-gray-500'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100">
          <h3 className="font-bold mb-6">Container Stats</h3>
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Containers</div>
              <div className="text-3xl font-black">42</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Avg CPU</div>
                <div className="text-xl font-bold uppercase">15.4%</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Avg RAM</div>
                <div className="text-xl font-bold uppercase">450MB</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold">Recent Signups</h3>
          <button className="text-sm font-bold text-[#FF5F1F] flex items-center gap-1 hover:underline">
            View all users <ChevronRight size={14} />
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] uppercase font-bold tracking-widest text-gray-400">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Level</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stats.recentUsers.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {user.avatarInitials || 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{user.name || 'Anonymous'}</div>
                      <div className="text-xs text-gray-400 font-medium">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600">{user.level}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.plan === 'Pro' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-gray-400">
                  {new Date(user.joinedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs font-bold text-[#FF5F1F] hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
