import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, role } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Wrong role redirects to that user's own page
    if (role === 'CUSTOMER') return <Navigate to="/dashboard" replace />;
    if (role === 'MECHANIC') return <Navigate to="/mechanic" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
