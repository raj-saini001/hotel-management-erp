import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';
import { useBookings } from '../../hooks/useBookings';

export const BookingChart = () => {
  const { bookings = [] } = useBookings();

  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = {};
    months.forEach((m) => { counts[m] = 0; });

    bookings.forEach((b) => {
      const dateStr = b.checkIn || b.bookingDate;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          const monthName = months[d.getMonth()];
          counts[monthName] = (counts[monthName] || 0) + 1;
        }
      }
    });

    // Show past 8 months or months with data
    const currentMonthIdx = new Date().getMonth();
    const result = [];
    for (let i = 0; i <= currentMonthIdx; i++) {
      result.push({ month: months[i], bookings: counts[months[i]] || 0 });
    }
    return result.length > 0 ? result : months.slice(0, 8).map(m => ({ month: m, bookings: 0 }));
  }, [bookings]);

  return (
    <Card title="Monthly Booking Trend" subtitle="Total guest reservations count per month">
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#bookingGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
