import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { InvoicePreview } from '../../components/booking/InvoicePreview';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useBookings } from '../../hooks/useBookings';

export const Invoice = () => {
  const { id } = useParams();
  const location = useLocation();
  const { bookings, loading } = useBookings();

  const bookingFromState = location.state?.bookingData;
  const foundBooking = bookings.find((b) => b.id === id || b.invoiceNo === id);
  const booking = bookingFromState || foundBooking || bookings[0];

  if (loading && !booking) {
    return <Loader text="Generating printable invoice..." />;
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <PageHeader title="Invoice Generator" subtitle="Printable tax receipt" />
        <EmptyState title="Booking Not Found" description="No matching booking record found to generate invoice." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Invoice Generator - ${booking.invoiceNo || 'Receipt'}`}
        subtitle="Printable tax receipt with GST breakdown and QR verification"
      />
      <InvoicePreview booking={booking} />
    </div>
  );
};
