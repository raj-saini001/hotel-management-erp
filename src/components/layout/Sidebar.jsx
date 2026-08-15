import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  PlusCircle,
  History,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  UserPlus,
  UserCheck,
  Activity,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Building2,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';
import { HOTEL_INFO } from '../../utils/constants';

export const Sidebar = ({ isMobileOpen, setIsMobileOpen, isCollapsed }) => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const [bookingMenuOpen, setBookingMenuOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(true);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    {
      label: 'Booking Management',
      icon: CalendarCheck,
      submenu: [
        { label: 'Add Booking', path: '/bookings/add', icon: PlusCircle },
        { label: 'Booking History', path: '/bookings/history', icon: History },
        { label: 'Upcoming', path: '/bookings/upcoming', icon: Clock },
        { label: 'Completed', path: '/bookings/completed', icon: CheckCircle2 },
        { label: 'Cancelled', path: '/bookings/cancelled', icon: XCircle },
        { label: 'Invoice Generator', path: '/bookings/invoice/BK-1001', icon: FileText },
      ],
      isOpen: bookingMenuOpen,
      setIsOpen: setBookingMenuOpen,
    },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Analytics', path: '/analytics', icon: TrendingUp },
    {
      label: 'User Management',
      icon: Users,
      submenu: [
        { label: 'Add Admin', path: '/users/add', icon: UserPlus },
        { label: 'Admin List', path: '/users/list', icon: UserCheck },
      ],
      isOpen: userMenuOpen,
      setIsOpen: setUserMenuOpen,
    },
    { label: 'Activity Logs', path: '/activity', icon: Activity },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-navy-900 border-r border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
      {/* Brand Logo Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-md shadow-brand-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">
                {settings?.hotelName || HOTEL_INFO.name}
              </h2>
              <p className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wider">
                ERP Staff Portal
              </p>
            </div>
          )}
        </div>
        {isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.submenu) {
            const isSubactive = item.submenu.some((sub) => location.pathname === sub.path);
            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => item.setIsOpen(!item.isOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isSubactive
                      ? 'text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        item.isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>
                {(!isCollapsed && item.isOpen) && (
                  <div className="pl-6 space-y-1">
                    {item.submenu.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <NavLink
                          key={sub.path}
                          to={sub.path}
                          onClick={() => setIsMobileOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                              isActive
                                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                            }`
                          }
                        >
                          <SubIcon className="w-3.5 h-3.5 shrink-0" />
                          <span>{sub.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'Admin'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30"
            />
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'Staff Admin'}</p>
                <p className="text-[10px] text-slate-400 capitalize truncate">{user?.role?.replace('_', ' ') || 'Super Admin'}</p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-64 max-w-xs z-10">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};
