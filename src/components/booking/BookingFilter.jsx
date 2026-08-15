import React from 'react';
import { SearchBar } from '../common/SearchBar';
import { Select } from '../common/Select';
import { DatePicker } from '../common/DatePicker';
import { BOOKING_STATUSES, PAYMENT_STATUSES } from '../../utils/constants';

export const BookingFilter = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  paymentFilter,
  onPaymentChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}) => {
  const bookingStatusOptions = [
    { id: 'All', name: 'All Statuses' },
    ...Object.values(BOOKING_STATUSES).map((s) => ({ id: s, name: s })),
  ];

  const paymentStatusOptions = [
    { id: 'All', name: 'All Payments' },
    ...Object.values(PAYMENT_STATUSES).map((p) => ({ id: p, name: p })),
  ];

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
      <div className="w-full lg:w-72">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={() => onSearchChange('')}
          placeholder="Search name, invoice, room..."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
        <Select
          options={bookingStatusOptions}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          placeholder=""
        />

        <Select
          options={paymentStatusOptions}
          value={paymentFilter}
          onChange={(e) => onPaymentChange(e.target.value)}
          placeholder=""
        />

        <DatePicker
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          placeholder="Start Date"
        />

        <DatePicker
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          placeholder="End Date"
        />
      </div>
    </div>
  );
};
