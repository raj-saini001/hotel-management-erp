import React from 'react';
import { Table } from '../common/Table';
import { BookingRow } from './BookingRow';
import { EmptyState } from '../common/EmptyState';

export const BookingTable = ({ bookings = [], onView, onEdit, onDownloadPdf, onDelete }) => {
  const headers = [
    'Invoice No',
    'Customer',
    'Room',
    'Check In',
    'Check Out',
    'Total Amount',
    'Payment',
    'Status',
    'Actions',
  ];

  if (!bookings || bookings.length === 0) {
    return (
      <EmptyState
        title="No Bookings Found"
        description="No booking records match your current filters or search terms."
      />
    );
  }

  return (
    <Table headers={headers}>
      {bookings.map((booking) => (
        <BookingRow
          key={booking.id}
          booking={booking}
          onView={onView}
          onEdit={onEdit}
          onDownloadPdf={onDownloadPdf}
          onDelete={onDelete}
        />
      ))}
    </Table>
  );
};
