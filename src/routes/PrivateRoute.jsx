import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { Loader } from '../components/common/Loader';

export const PrivateRoute = ({ requiredPermission = null }) => {
  const { isAuthenticated, loading } = useAuth();
  const { hasPermission, canAccess } = usePermissions();
  const location = useLocation();

  if (loading) {
    return <Loader fullPage text="Verifying staff security credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific module permission is required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If route is restricted
  if (!canAccess(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
