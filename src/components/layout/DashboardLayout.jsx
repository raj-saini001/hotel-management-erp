import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Breadcrumb } from '../common/Breadcrumb';
import { GlobalSearchModal } from './GlobalSearchModal';

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearchEvent = () => setIsSearchOpen(true);
    window.addEventListener('open-global-search', handleOpenSearchEvent);
    return () => window.removeEventListener('open-global-search', handleOpenSearchEvent);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col transition-colors">
      <Sidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Navbar
          onToggleSidebar={() => setIsCollapsed(!isCollapsed)}
          onToggleMobileSidebar={() => setIsMobileOpen(!isMobileOpen)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          <Breadcrumb />
          <Outlet />
        </main>
      </div>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};
