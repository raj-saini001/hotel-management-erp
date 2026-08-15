import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CalendarCheck, BarChart3, Users, Settings, ArrowRight } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useBookings } from '../../hooks/useBookings';

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { bookings } = useBookings();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-global-search'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const quickPages = [
    { title: 'Add New Booking', route: '/bookings/add', category: 'Action', icon: CalendarCheck },
    { title: 'Booking History', route: '/bookings/history', category: 'Module', icon: CalendarCheck },
    { title: 'Financial Reports', route: '/reports', category: 'Reports', icon: BarChart3 },
    { title: 'Staff & Admin Management', route: '/users/list', category: 'Users', icon: Users },
    { title: 'Hotel ERP Settings', route: '/settings', category: 'Settings', icon: Settings },
  ];

  const filteredBookings = query
    ? bookings.filter(
        (b) =>
          b.customerName.toLowerCase().includes(query.toLowerCase()) ||
          b.invoiceNo.toLowerCase().includes(query.toLowerCase()) ||
          b.roomNumber.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-4">
        <div className="relative flex items-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type customer name, invoice #, room or module..."
            className="w-full bg-transparent text-base font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
        </div>

        {/* Search Results */}
        {query ? (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Matching Bookings</p>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleSelect(`/bookings/invoice/${b.id}`)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {b.customerName} ({b.invoiceNo})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Room {b.roomNumber} • {b.roomType} • Status: {b.bookingStatus}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">No bookings match "{query}"</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Quick Navigation Shortcuts</p>
            {quickPages.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.route}
                  onClick={() => handleSelect(p.route)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{p.title}</p>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{p.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
