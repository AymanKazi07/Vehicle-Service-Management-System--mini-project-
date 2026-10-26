import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { MechanicPage } from './pages/MechanicPage';
import { AdminPage } from './pages/AdminPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { useAuth } from './context/AuthContext';

const RoleRedirect = () => {
  const { token, role } = useAuth();
  if (!token) return <Navigate to="/auth" replace />;
  if (role === 'CUSTOMER') return <Navigate to="/dashboard" replace />;
  if (role === 'MECHANIC') return <Navigate to="/mechanic" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;
  return <Navigate to="/auth" replace />;
};

export const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mechanic"
        element={
          <ProtectedRoute allowedRoles={['MECHANIC']}>
            <MechanicPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* "/" redirects by role */}
      <Route path="/" element={<RoleRedirect />} />

      {/* anything else goes to /auth */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default App;
