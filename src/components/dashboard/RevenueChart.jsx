import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';
import { useBookings } from '../../hooks/useBookings';
import { useSettings } from '../../hooks/useSettings';

export const RevenueChart = () => {
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
      result.push({ month: months[i], revenue: revenueMap[months[i]] || 0 });
    }
    return result.length > 0 ? result : months.slice(0, 8).map(m => ({ month: m, revenue: 0 }));
  }, [bookings]);

  return (
    <Card title="Revenue Growth Graph" subtitle={`Gross income generated (${symbol})`}>
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              formatter={(val) => `${symbol}${Number(val).toLocaleString()}`}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
