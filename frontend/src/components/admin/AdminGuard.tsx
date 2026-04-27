import { Navigate, Outlet } from 'react-router-dom';
import { User } from '../../types';

interface AdminGuardProps { user: User | null; }

export function AdminGuard({ user }: AdminGuardProps) {
  if (!user) return <Navigate to="/auth" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;
  return <Outlet />;
}
