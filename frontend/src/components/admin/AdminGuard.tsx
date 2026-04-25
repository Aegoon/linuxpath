import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { User } from '../../types';

interface AdminGuardProps {
  user: User | null;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ user }) => {
  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};
