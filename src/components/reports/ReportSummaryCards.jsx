import React from 'react';
import { CalendarCheck, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/dateFormatter';
import { useSettings } from '../../hooks/useSettings';

export const ReportSummaryCards = ({ data }) => {
  const { settings } = useSettings();
  const symbol = settings?.currencySymbol || '$';

  const cards = [
    {
      title: 'Total Reservations',
      value: data?.totalBookings || 0,
      subtext: `${data?.cancelledCount || 0} cancellations`,
      icon: CalendarCheck,
      color: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40',
    },
    {
      title: 'Gross Billed Revenue',
      value: formatCurrency(data?.totalRevenue || 0, symbol),
      subtext: 'Before tax deductions',
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Payments Collected',
      value: formatCurrency(data?.paidRevenue || 0, symbol),
      subtext: 'Received in bank/cash',
      icon: CheckCircle2,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40',
    },
    {
      title: 'Outstanding Balance',
      value: formatCurrency(data?.pendingRevenue || 0, symbol),
      subtext: 'Pending guest collection',
      icon: AlertCircle,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.title}</p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{c.value}</h3>
              <p className="text-[11px] text-slate-400 mt-1">{c.subtext}</p>
            </div>
            <div className={`p-3 rounded-xl ${c.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
