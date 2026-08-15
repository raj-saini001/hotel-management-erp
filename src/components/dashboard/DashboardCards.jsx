import React from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, DollarSign, TrendingUp, Award } from 'lucide-react';
import { formatCurrency } from '../../utils/dateFormatter';
import { useSettings } from '../../hooks/useSettings';

export const DashboardCards = ({ stats }) => {
  const { settings } = useSettings();
  const symbol = settings?.currencySymbol || '$';

  const cards = [
    {
      title: "Today's Bookings",
      value: stats?.todayCount || 0,
      subtext: 'Check-ins scheduled today',
      icon: Calendar,
      color: 'from-blue-500 to-brand-600',
      textColor: 'text-brand-600 dark:text-brand-400',
      bgColor: 'bg-brand-50 dark:bg-brand-950/40',
    },
    {
      title: 'Upcoming Bookings',
      value: stats?.upcomingCount || 0,
      subtext: 'Confirmed future arrivals',
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'Completed Stays',
      value: stats?.completedCount || 0,
      subtext: 'Successful check-outs',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Cancelled Bookings',
      value: stats?.cancelledCount || 0,
      subtext: 'Cancellations recorded',
      icon: XCircle,
      color: 'from-rose-500 to-red-600',
      textColor: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
    },
    {
      title: 'Pending Payments',
      value: stats?.pendingPaymentsCount || 0,
      subtext: `Total Due: ${formatCurrency(stats?.pendingAmountTotal || 0, symbol)}`,
      icon: AlertCircle,
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0, symbol),
      subtext: 'Gross revenue earned',
      icon: DollarSign,
      color: 'from-emerald-600 to-green-700',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Current Year Bookings',
      value: stats?.yearBookingsCount || stats?.totalBookingsCount || 0,
      subtext: 'Total bookings YTD',
      icon: TrendingUp,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
    },
    {
      title: 'Monthly Revenue',
      value: formatCurrency(stats?.monthlyRevenue || 0, symbol),
      subtext: 'Current month earnings',
      icon: Award,
      color: 'from-violet-500 to-purple-600',
      textColor: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-50 dark:bg-violet-950/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1.5">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${card.bgColor} ${card.textColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 font-medium">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
