import { ADMIN_ROLES, PERMISSIONS_LIST } from './constants';

/**
 * Default permissions automatically granted based on staff role
 */
export const DEFAULT_ROLE_PERMISSIONS = {
  super_admin: [
    'manage_bookings',
    'view_reports',
    'view_analytics',
    'manage_admins',
    'manage_settings',
  ],
  manager: [
    'manage_bookings',
    'view_reports',
    'view_analytics',
  ],
  receptionist: [
    'manage_bookings',
  ],
  accountant: [
    'view_reports',
    'view_analytics',
  ],
};

/**
 * Route permission map defining the required permission key for each route pattern
 */
export const ROUTE_PERMISSION_MAP = {
  '/dashboard': null, // Public to all authenticated staff
  '/bookings/add': 'manage_bookings',
  '/bookings/history': 'manage_bookings',
  '/bookings/upcoming': 'manage_bookings',
  '/bookings/completed': 'manage_bookings',
  '/bookings/cancelled': 'manage_bookings',
  '/bookings/invoice': 'manage_bookings',
  '/reports': 'view_reports',
  '/analytics': 'view_analytics',
  '/users/add': 'manage_admins',
  '/users/list': 'manage_admins',
  '/activity': null, // Super Admins, Managers, or staff with manage_admins/manage_settings
  '/settings': 'manage_settings',
  '/profile': null, // Accessible to all authenticated staff
};

/**
 * Check whether a user has a specific module permission
 * @param {object} user - The authenticated user object
 * @param {string} permissionKey - e.g. 'manage_bookings', 'manage_settings'
 * @returns {boolean}
 */
export const hasPermission = (user, permissionKey) => {
  if (!user) return false;

  const role = user.role || 'receptionist';

  // Super Admin always has all permissions
  if (role === 'super_admin') {
    return true;
  }

  // Check if role has default permission
  const roleDefaults = DEFAULT_ROLE_PERMISSIONS[role] || [];
  if (roleDefaults.includes(permissionKey)) {
    return true;
  }

  // Check custom granted permissions array
  const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
  return userPermissions.includes(permissionKey);
};

/**
 * Check whether a user can access a specific route pathname
 * @param {object} user - The authenticated user object
 * @param {string} pathname - e.g. '/settings', '/reports', '/users/list'
 * @returns {boolean}
 */
export const canAccessRoute = (user, pathname) => {
  if (!user) return false;

  // Super Admin can access all routes
  if (user.role === 'super_admin') {
    return true;
  }

  // Activity logs specific check: accessible to managers or staff with admin/settings permissions
  if (pathname.startsWith('/activity')) {
    return (
      user.role === 'manager' ||
      hasPermission(user, 'manage_admins') ||
      hasPermission(user, 'manage_settings')
    );
  }

  // Find matching route key
  for (const [routePattern, requiredPerm] of Object.entries(ROUTE_PERMISSION_MAP)) {
    if (pathname === routePattern || (routePattern !== '/dashboard' && pathname.startsWith(routePattern))) {
      if (!requiredPerm) return true;
      return hasPermission(user, requiredPerm);
    }
  }

  return true;
};

/**
 * Get human-readable role name
 * @param {string} roleKey
 * @returns {string}
 */
export const getRoleDisplayName = (roleKey) => {
  const match = ADMIN_ROLES.find((r) => r.id === roleKey);
  return match ? match.name : roleKey || 'Staff';
};
