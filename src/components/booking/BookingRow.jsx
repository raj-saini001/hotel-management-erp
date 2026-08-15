import React from 'react';
import { Eye, Edit3, Download, Trash2, Calendar, Home } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/dateFormatter';
import { useSettings } from '../../hooks/useSettings';

export const BookingRow = ({ booking, onView, onEdit, onDownloadPdf, onDelete }) => {
  const { settings } = useSettings();
  const symbol = settings?.currencySymbol || '$';

  return (
    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
      {/* Invoice No */}
      <td className="px-5 py-3.5 font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">
        {booking.invoiceNo}
      </td>

      {/* Customer */}
      <td className="px-5 py-3.5">
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{booking.customerName}</p>
          <p className="text-[11px] text-slate-500">{booking.mobile}</p>
        </div>
      </td>

      {/* Room */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
          <Home className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold">{booking.roomNumber}</span>
          <span className="text-slate-400">({booking.roomType})</span>
        </div>
      </td>

      {/* Check In */}
      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {formatDate(booking.checkIn)}
      </td>

      {/* Check Out */}
      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {formatDate(booking.checkOut)}
      </td>

      {/* Amount */}
      <td className="px-5 py-3.5">
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">
            {formatCurrency(booking.totalAmount, symbol)}
          </p>
          {booking.remainingAmount > 0 && (
            <p className="text-[10px] text-rose-500 font-medium">
              Due: {formatCurrency(booking.remainingAmount, symbol)}
            </p>
          )}
        </div>
      </td>

      {/* Payment */}
      <td className="px-5 py-3.5">
        <Badge status={booking.paymentStatus} />
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <Badge status={booking.bookingStatus} />
      </td>

      {/* Actions */}
      <td className="px-5 py-3.5 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" title="View Booking Details" onClick={() => onView(booking)}>
            <Eye className="w-4 h-4 text-slate-500 hover:text-brand-600" />
          </Button>
          <Button variant="ghost" size="icon" title="Edit Booking" onClick={() => onEdit(booking)}>
            <Edit3 className="w-4 h-4 text-slate-500 hover:text-amber-600" />
          </Button>
          <Button variant="ghost" size="icon" title="Download Invoice PDF" onClick={() => onDownloadPdf(booking)}>
            <Download className="w-4 h-4 text-slate-500 hover:text-emerald-600" />
          </Button>
          <Button variant="ghost" size="icon" title="Delete Booking" onClick={() => onDelete(booking)}>
            <Trash2 className="w-4 h-4 text-slate-500 hover:text-rose-600" />
          </Button>
        </div>
      </td>
    </tr>
  );
};
