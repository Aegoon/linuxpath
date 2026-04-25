import React, { useState, useEffect } from 'react';
import { 
  X, 
  Shield, 
  Zap, 
  RotateCcw, 
  Ban,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserSlideOverProps {
  userId: string | null;
  onClose: () => void;
}

export const UserSlideOver: React.FC<UserSlideOverProps> = ({ userId, onClose }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      fetch(`/api/admin/users/${userId}`)
        .then(res => res.json())
        .then(setUser);
    } else {
      setUser(null);
    }
  }, [userId]);

  const handleAction = async (action: string) => {
    if (!userId) return;
    const res = await fetch(`/api/admin/users/${userId}/${action}`, { method: 'POST' });
    if (res.ok) {
      // Refresh user data
      fetch(`/api/admin/users/${userId}`)
        .then(res => res.json())
        .then(setUser);
    }
  };

  return (
    <AnimatePresence>
      {userId && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" 
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-[101] overflow-y-auto"
          >
            {user ? (
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black">User Details</h2>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100">
                  <div className="w-24 h-24 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-4xl shadow-xl shadow-blue-500/10">
                    {user.avatarInitials || user.name?.substring(0,2).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black flex items-center gap-2">
                      {user.name}
                      {user.role === 'admin' && <Shield size={20} className="text-blue-500" />}
                    </h3>
                    <p className="text-gray-400 font-medium">{user.email}</p>
                    <div className="flex gap-2 pt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${user.subscription?.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                        {user.subscription?.status === 'active' ? 'Pro Member' : 'Free Plan'}
                      </span>
                      {user.isBanned && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-50 text-red-600 border border-red-100">
                          Banned
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-12">
                  <button 
                    onClick={() => handleAction('upgrade')}
                    className="p-4 rounded-2xl border border-blue-100 bg-blue-50 text-blue-700 flex flex-col items-center gap-2 font-bold text-sm hover:bg-blue-100 transition-all"
                  >
                    <Zap size={20} className="fill-blue-700" />
                    Upgrade to Pro
                  </button>
                  <button 
                    onClick={() => handleAction('reset')}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50 text-gray-700 flex flex-col items-center gap-2 font-bold text-sm hover:bg-gray-100 transition-all"
                  >
                    <RotateCcw size={20} />
                    Reset Progress
                  </button>
                  <button 
                    onClick={() => handleAction('ban')}
                    className="p-4 rounded-2xl border border-red-100 bg-red-50 text-red-700 flex flex-col items-center gap-2 font-bold text-sm hover:bg-red-100 transition-all col-span-2"
                  >
                    <Ban size={20} />
                    Ban Account
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                      <Clock size={14} /> Lesson Progress
                    </h4>
                    <div className="space-y-4">
                      {user.progress?.map((p: any) => (
                        <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <CheckCircle2 size={16} className="text-green-500" />
                          <div className="flex-1 text-sm font-bold">{p.lesson.title}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{new Date(p.completedAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                      {!user.progress?.length && <p className="text-sm text-gray-400 italic">No progress recorded yet.</p>}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                      <Award size={14} /> Certificates
                    </h4>
                    <div className="space-y-4">
                      {user.certificates?.map((c: any) => (
                        <div key={c.id} className="p-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center gap-4">
                            <Award className="text-blue-500" size={32} />
                            <div>
                                <div className="font-black">Level {c.level.id} Certified</div>
                                <div className="text-xs text-gray-400 font-medium">Issued {new Date(c.issuedAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                      ))}
                      {!user.certificates?.length && <p className="text-sm text-gray-400 italic">No certificates earned yet.</p>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 flex items-center justify-center h-full text-gray-400 font-medium">Loading user details...</div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
