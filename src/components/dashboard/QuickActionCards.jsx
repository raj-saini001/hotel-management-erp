import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileSpreadsheet, History, Users } from 'lucide-react';

export const QuickActionCards = () => {
  const actions = [
    {
      title: 'New Reservation',
      desc: 'Create guest booking',
      icon: PlusCircle,
      link: '/bookings/add',
      color: 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20',
    },
    {
      title: 'Generate Reports',
      desc: 'Export daily/monthly PDF',
      icon: FileSpreadsheet,
      link: '/reports',
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
    },
    {
      title: 'Booking Audit',
      desc: 'View complete history',
      icon: History,
      link: '/bookings/history',
      color: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20',
    },
    {
      title: 'Manage Staff',
      desc: 'Add or configure admins',
      icon: Users,
      link: '/users/list',
      color: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <Link
            key={idx}
            to={act.link}
            className={`p-4 rounded-2xl ${act.color} shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3.5`}
          >
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold">{act.title}</h4>
              <p className="text-[11px] text-white/80 mt-0.5">{act.desc}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
