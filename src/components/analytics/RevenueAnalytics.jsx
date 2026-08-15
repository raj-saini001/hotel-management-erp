import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';
import { useBookings } from '../../hooks/useBookings';
import { useSettings } from '../../hooks/useSettings';

export const RevenueAnalytics = () => {
  const { bookings = [] } = useBookings();
  const { settings } = useSettings();
  const symbol = settings?.currencySymbol || '$';

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueMap = {};
    months.forEach((m) => { revenueMap[m] = 0; });

    bookings.forEach((b) => {
      if (b.bookingStatus !== 'Cancelled') {
        const dateStr = b.checkIn || b.bookingDate;
        if (dateStr) {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            const monthName = months[d.getMonth()];
            const amount = (Number(b.advanceAmount) || 0) + (b.paymentStatus === 'Paid' ? Number(b.remainingAmount) || 0 : 0);
            revenueMap[monthName] = (revenueMap[monthName] || 0) + amount;
          }
        }
      }
    });

    const currentMonthIdx = new Date().getMonth();
    const result = [];
    for (let i = 0; i <= currentMonthIdx; i++) {
      const rev = revenueMap[months[i]] || 0;
      const forecast = Math.round(rev * 1.1) || 500;
      result.push({ month: months[i], revenue: rev, forecast });
    }
    return result.length > 0 ? result : months.slice(0, 8).map(m => ({ month: m, revenue: 0, forecast: 500 }));
  }, [bookings]);

  return (
    <Card title="Revenue Performance & Target Forecast" subtitle={`Actual vs Projected Monthly Income (${symbol})`}>
      <div className="h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip formatter={(val) => `${symbol}${Number(val).toLocaleString()}`} />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#revActual)" name="Actual Revenue" />
            <Area type="monotone" dataKey="forecast" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} fillOpacity={0} name="Forecast Target" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
