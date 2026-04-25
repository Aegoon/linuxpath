import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ArrowDownRight,
  ArrowUpRight,
  Download
} from 'lucide-react';

export default function AdminRevenue() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Revenue</h1>
          <p className="text-gray-500">Stripe measurements and subscription analytics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all">
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'MRR', value: '$2,480', change: '+14.2%', icon: <TrendingUp className="text-blue-500" /> },
          { label: 'Net Revenue', value: '$8,940', change: '+8.1%', icon: <BarChart3 className="text-green-500" /> },
          { label: 'Churn Rate', value: '2.4%', change: '-0.3%', icon: <ArrowDownRight className="text-red-500" /> },
          { label: 'Active Subs', value: '215', change: '+12', icon: <Users className="text-purple-500" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
              <div className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
                {stat.change}
              </div>
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-3xl font-black">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 min-h-[450px] shadow-sm">
        <h3 className="font-bold mb-8">Revenue Analytics (MRR Trend)</h3>
        <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl text-gray-300 font-mono text-sm">
          [Revenue Chart.js Component]
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[10px] uppercase font-bold tracking-widest text-gray-400">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm font-medium">
            {[1,2,3,4,5].map(i => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">2024-04-{15+i}</td>
                <td className="px-6 py-4 font-bold">student_{i}@gmail.com</td>
                <td className="px-6 py-4">Pro Monthly</td>
                <td className="px-6 py-4">$12.00</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-green-50 text-green-600 border border-green-100">
                    Succeeded
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
