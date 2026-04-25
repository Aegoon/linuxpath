import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  Activity
} from 'lucide-react';

export default function AdminContainers() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/admin/containers/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const killContainer = async (id: string) => {
    if (confirm(`Kill container ${id}?`)) {
      await fetch(`/api/admin/containers/${id}`, { method: 'DELETE' });
      fetchStats();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Docker Monitor</h1>
          <p className="text-gray-500">Live view of student interactive environments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition-all">
            <Trash2 size={16} />
            Kill All Idle
          </button>
          <button 
            onClick={fetchStats}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Active', value: stats?.total || 0, color: 'bg-green-500' },
          { label: 'Idle', value: stats?.idle || 0, color: 'bg-yellow-500' },
          { label: 'Avg CPU', value: `${stats?.avgCpu || 0}%`, color: 'bg-blue-500' },
          { label: 'Avg RAM', value: `${stats?.avgMemory || 0}MB`, color: 'bg-purple-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${s.color}`} />
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</div>
            </div>
            <div className="text-3xl font-black">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] uppercase font-bold tracking-widest text-gray-400">
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Container ID</th>
              <th className="px-6 py-4">Created At</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stats?.containers.map((c: any) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold">{c.student}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">{c.id}</div>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-gray-400">
                  {new Date(c.createdAt).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
                    <span className="flex items-center gap-1"><Activity size={12} /> {c.cpu}%</span>
                    <span>{c.memory}MB</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${c.status === 'running' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => killContainer(c.id)}
                    className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
