import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  UserPlus, 
  Timer
} from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: '',
    supportEmail: '',
    maxContainerLifetimeMins: 30,
    maxContainersPerUser: 1,
    maintenanceMode: false,
    allowNewSignups: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) {
      alert('Settings saved successfully!');
    }
    setSaving(false);
  };

  if (loading) return null;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-gray-500">Configure global platform behavior and limits.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-3">
            <SettingsIcon className="text-[#FF5F1F]" />
            <h3 className="font-bold">General Configuration</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Platform Name</label>
                <input 
                  type="text"
                  value={settings.platformName}
                  onChange={e => setSettings({...settings, platformName: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5F1F]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Support Email</label>
                <input 
                  type="email"
                  value={settings.supportEmail}
                  onChange={e => setSettings({...settings, supportEmail: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5F1F]/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-3">
            <Timer className="text-blue-500" />
            <h3 className="font-bold">Resource Limits</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Max Session (mins)</label>
                <input 
                  type="number"
                  value={settings.maxContainerLifetimeMins}
                  onChange={e => setSettings({...settings, maxContainerLifetimeMins: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5F1F]/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Max Containers / User</label>
                <input 
                  type="number"
                  value={settings.maxContainersPerUser}
                  onChange={e => setSettings({...settings, maxContainersPerUser: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5F1F]/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-3">
            <Shield className="text-purple-500" />
            <h3 className="font-bold">Access Control</h3>
          </div>
          <div className="p-8 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <Bell className={settings.maintenanceMode ? 'text-orange-500' : 'text-gray-400'} />
                <div>
                  <div className="text-sm font-bold">Maintenance Mode</div>
                  <div className="text-xs text-gray-500 font-medium tracking-tight">Show global maintenance banner to students</div>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`w-12 h-6 rounded-full relative p-1 transition-colors ${settings.maintenanceMode ? 'bg-orange-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <UserPlus className={settings.allowNewSignups ? 'text-green-500' : 'text-gray-400'} />
                <div>
                  <div className="text-sm font-bold">Allow New Signups</div>
                  <div className="text-xs text-gray-500 font-medium tracking-tight">Open registration to new students</div>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setSettings({...settings, allowNewSignups: !settings.allowNewSignups})}
                className={`w-12 h-6 rounded-full relative p-1 transition-colors ${settings.allowNewSignups ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.allowNewSignups ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-black/10 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
