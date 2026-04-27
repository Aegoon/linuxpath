import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface NavProps { user: User | null; }

export function Nav({ user }: NavProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between bg-black">
      <Link to="/" className="text-white font-semibold text-lg">LinuxPath</Link>
      <div className="flex items-center gap-6">
        <Link to="/pricing" className="text-gray-400 hover:text-white text-sm">Pricing</Link>
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm">Dashboard</Link>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white text-sm">Logout</button>
          </>
        ) : (
          <Link to="/auth" className="bg-white text-black px-4 py-2 rounded text-sm font-medium">Get started</Link>
        )}
      </div>
    </nav>
  );
}
