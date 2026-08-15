import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, User } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const UpcomingWidget = ({ bookings = [] }) => {
  const upcoming = bookings
    .filter((b) => b.bookingStatus === 'Confirmed')
    .slice(0, 4);

  return (
    <Card
      title="Upcoming Check-ins"
      subtitle="Guests arriving soon"
      action={
        <Link
          to="/bookings/upcoming"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <div className="space-y-3">
        {upcoming.length > 0 ? (
          upcoming.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{b.customerName}</p>
                  <p className="text-[11px] text-slate-500">
                    Room {b.roomNumber} • {b.roomType}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge status={b.bookingStatus} />
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" /> {b.checkIn}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 text-center py-6">No upcoming check-ins found</p>
        )}
      </div>
    </Card>
  );
};
