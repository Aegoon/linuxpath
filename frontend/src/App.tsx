import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Nav } from './components/Nav';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PlacementTest } from './pages/PlacementTest';
import { CoursePage } from './pages/CoursePage';
import { PricingPage } from './pages/PricingPage';
import { Auth } from './pages/Auth';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminGuard } from './components/admin/AdminGuard';

const AdminOverview = React.lazy(() => import('./pages/admin/AdminOverview'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminCourses = React.lazy(() => import('./pages/admin/AdminCourses'));
const AdminRevenue = React.lazy(() => import('./pages/admin/AdminRevenue'));
const AdminContainers = React.lazy(() => import('./pages/admin/AdminContainers'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));

import { supabase } from './lib/supabase';
import { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = window.location.pathname;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          level: 1,
          streak: 0,
          xp: 0,
          subscriptionActive: false
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          level: 1,
          streak: 0,
          xp: 0,
          subscriptionActive: false
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  const showNav = user || (window.location.pathname !== '/' && window.location.pathname !== '/auth');

  return (
    <Router>
      <div className="min-h-screen flex flex-col technical-grid">
        <NavWrapper user={user} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/auth" />} />
            <Route path="/placement" element={<PlacementTest user={user} />} />
            <Route path="/course/:levelId" element={user ? <CoursePage user={user} /> : <Navigate to="/auth" />} />
            <Route path="/pricing" element={<PricingPage />} />
            
            {/* Admin Routes */}
            <Route element={<AdminGuard user={user} />}>
              <Route path="/admin" element={
                <AdminLayout>
                  <React.Suspense fallback={<div className="p-8 text-gray-400 font-medium">Loading admin console...</div>}>
                    <AdminOverview />
                  </React.Suspense>
                </AdminLayout>
              } />
              <Route path="/admin/users" element={
                <AdminLayout>
                  <React.Suspense fallback={<div className="p-8 text-gray-400 font-medium">Loading admin console...</div>}>
                    <AdminUsers />
                  </React.Suspense>
                </AdminLayout>
              } />
              <Route path="/admin/courses" element={
                <AdminLayout>
                  <React.Suspense fallback={<div className="p-8 text-gray-400 font-medium">Loading admin console...</div>}>
                    <AdminCourses />
                  </React.Suspense>
                </AdminLayout>
              } />
              <Route path="/admin/revenue" element={
                <AdminLayout>
                  <React.Suspense fallback={<div className="p-8 text-gray-400 font-medium">Loading admin console...</div>}>
                    <AdminRevenue />
                  </React.Suspense>
                </AdminLayout>
              } />
              <Route path="/admin/containers" element={
                <AdminLayout>
                  <React.Suspense fallback={<div className="p-8 text-gray-400 font-medium">Loading admin console...</div>}>
                    <AdminContainers />
                  </React.Suspense>
                </AdminLayout>
              } />
              <Route path="/admin/settings" element={
                <AdminLayout>
                  <React.Suspense fallback={<div className="p-8 text-gray-400 font-medium">Loading admin console...</div>}>
                    <AdminSettings />
                  </React.Suspense>
                </AdminLayout>
              } />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NavWrapper({ user }: { user: User | null }) {
  const { pathname } = useLocation();
  if (pathname === '/') return null;
  return <Nav user={user} />;
}
