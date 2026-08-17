import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { hasPermission as checkPermission, canAccessRoute, getRoleDisplayName } from '../utils/permissions';

export const usePermissions = () => {
  const { user } = useAuth();

  const role = user?.role || 'receptionist';
  const isSuperAdmin = role === 'super_admin';
  const isManager = role === 'manager';
  const isReceptionist = role === 'receptionist';
  const isAccountant = role === 'accountant';

  const userPermissions = useMemo(() => {
    return Array.isArray(user?.permissions) ? user.permissions : [];
  }, [user?.permissions]);

  const hasPermission = (permissionKey) => {
    return checkPermission(user, permissionKey);
  };

  const canAccess = (pathname) => {
    return canAccessRoute(user, pathname);
  };

  const roleDisplayName = useMemo(() => {
    return getRoleDisplayName(role);
  }, [role]);

  return {
    user,
    role,
    roleDisplayName,
    isSuperAdmin,
    isManager,
    isReceptionist,
    isAccountant,
    permissions: userPermissions,
    hasPermission,
    canAccess,
  };
};
