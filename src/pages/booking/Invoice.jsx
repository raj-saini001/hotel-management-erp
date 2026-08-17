import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { InvoicePreview } from '../../components/booking/InvoicePreview';
import { Loader } from '../../components/common/Loader';
import { EmptyState } from '../../components/common/EmptyState';
import { useBookings } from '../../hooks/useBookings';
import { bookingService } from '../../services/bookingService';

export const Invoice = () => {
  const { id } = useParams();
  const location = useLocation();
  const { bookings, loading } = useBookings();
  const [directBooking, setDirectBooking] = useState(null);
  const [fetchingDirect, setFetchingDirect] = useState(false);

  const bookingFromState = location.state?.bookingData;
  const foundBooking = bookings.find((b) => b.id === id || b.invoiceNo === id || b.bookingRef === id);

  useEffect(() => {
    if (id && !bookingFromState && !foundBooking && id !== 'new') {
      let isSubscribed = true;
      setFetchingDirect(true);
      bookingService
        .getBookingById(id)
        .then((data) => {
          if (isSubscribed && data) setDirectBooking(data);
        })
        .catch((err) => {
          console.warn('[Invoice] Direct fetch notice:', err.message);
        })
        .finally(() => {
          if (isSubscribed) setFetchingDirect(false);
        });
      return () => {
        isSubscribed = false;
      };
    }
  }, [id, bookingFromState, foundBooking]);

  const booking = bookingFromState || foundBooking || directBooking || (id === 'new' ? bookings[0] : null);

  if ((loading || fetchingDirect) && !booking) {
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

