import React from 'react';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/dateFormatter';
import { useSettings } from '../../hooks/useSettings';

export const ReportTable = ({ bookings = [] }) => {
  const { settings } = useSettings();
  const symbol = settings?.currencySymbol || '$';
  const headers = ['Invoice No', 'Guest Name', 'Room', 'Check In', 'Check Out', 'Amount', 'Paid', 'Status'];

  return (
    <Table headers={headers}>
      {bookings.map((b) => (
        <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
          <td className="px-5 py-3.5 font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
            {b.invoiceNo}
          </td>
          <td className="px-5 py-3.5 font-semibold text-xs text-slate-900 dark:text-slate-100">
            {b.customerName}
          </td>
          <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400">
            Room {b.roomNumber} ({b.roomType})
          </td>
          <td className="px-5 py-3.5 text-xs text-slate-500">{formatDate(b.checkIn)}</td>
          <td className="px-5 py-3.5 text-xs text-slate-500">{formatDate(b.checkOut)}</td>
          <td className="px-5 py-3.5 font-bold text-xs text-slate-900 dark:text-slate-100">
            {formatCurrency(b.totalAmount, symbol)}
          </td>
          <td className="px-5 py-3.5 text-xs font-semibold text-emerald-600">
            {formatCurrency(b.advanceAmount, symbol)}
          </td>
          <td className="px-5 py-3.5">
            <Badge status={b.bookingStatus} />
          </td>
        </tr>
      ))}
    </Table>
  );
};
