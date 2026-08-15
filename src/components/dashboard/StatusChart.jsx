import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../common/Card';
import { useBookings } from '../../hooks/useBookings';

export const StatusChart = () => {
  const { bookings = [] } = useBookings();

  const chartData = useMemo(() => {
    const total = bookings.length;
    if (total === 0) {
      return [
        { name: 'Confirmed', value: 0, color: '#3b82f6' },
        { name: 'Checked In', value: 0, color: '#10b981' },
        { name: 'Checked Out', value: 0, color: '#8b5cf6' },
        { name: 'Cancelled', value: 0, color: '#f43f5e' },
      ];
    }

    const counts = {
      'Confirmed': 0,
      'Checked In': 0,
      'Checked Out': 0,
      'Cancelled': 0,
    };

    bookings.forEach((b) => {
      const st = b.bookingStatus;
      if (counts[st] !== undefined) {
        counts[st] += 1;
      }
    });

    return [
      { name: 'Confirmed', value: Math.round((counts['Confirmed'] / total) * 100) || 0, color: '#3b82f6' },
      { name: 'Checked In', value: Math.round((counts['Checked In'] / total) * 100) || 0, color: '#10b981' },
      { name: 'Checked Out', value: Math.round((counts['Checked Out'] / total) * 100) || 0, color: '#8b5cf6' },
      { name: 'Cancelled', value: Math.round((counts['Cancelled'] / total) * 100) || 0, color: '#f43f5e' },
    ];
  }, [bookings]);

  return (
    <Card title="Booking Status Distribution" subtitle="Percentage breakdown by stay status">
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val) => `${val}%`}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
