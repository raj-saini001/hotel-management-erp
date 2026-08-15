import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../common/Card';
import { useBookings } from '../../hooks/useBookings';

export const BookingTrends = () => {
  const { bookings = [] } = useBookings();

  const chartData = useMemo(() => {
    const categories = ['Standard Room', 'Deluxe Suite', 'Executive Suite', 'Family Suite', 'Presidential Suite'];
    const map = {};
    categories.forEach((cat) => {
      map[cat] = { Q1: 0, Q2: 0, Q3: 0 };
    });

    bookings.forEach((b) => {
      const type = b.roomType || 'Standard Room';
      if (!map[type]) map[type] = { Q1: 0, Q2: 0, Q3: 0 };

      const d = new Date(b.checkIn || b.bookingDate);
      if (!isNaN(d.getTime())) {
        const month = d.getMonth();
        if (month <= 2) map[type].Q1 += 1;
        else if (month <= 5) map[type].Q2 += 1;
        else if (month <= 8) map[type].Q3 += 1;
      }
    });

    return categories.map((cat) => ({
      roomType: cat.replace(' Room', '').replace(' Suite', ''),
      Q1: map[cat].Q1,
      Q2: map[cat].Q2,
      Q3: map[cat].Q3,
    }));
  }, [bookings]);

  return (
    <Card title="Room Category Demand by Quarter" subtitle="Volume of room nights booked per tier">
      <div className="h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="roomType" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
            <Bar dataKey="Q1" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Q2" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Q3" fill="#ec4899" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
