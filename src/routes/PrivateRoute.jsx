import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from '../components/common/Loader';

export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullPage text="Verifying staff security credentials..." />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
