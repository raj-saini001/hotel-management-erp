import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { BookingForm } from '../../components/booking/BookingForm';
import { useBookings } from '../../hooks/useBookings';

export const AddBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addBooking, updateBooking } = useBookings();
  const editingBooking = location.state?.booking || null;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      if (editingBooking) {
        await updateBooking(editingBooking.id, data);
      } else {
        await addBooking(data);
      }
      navigate('/bookings/history');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = (data) => {
    const targetId = editingBooking?.id || editingBooking?.invoiceNo || 'new';
    navigate(`/bookings/invoice/${targetId}`, { state: { bookingData: { ...editingBooking, ...data } } });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={editingBooking ? `Edit Booking ${editingBooking.invoiceNo}` : 'New Guest Reservation Form'}
        subtitle="Enter guest contact, stay duration, room assignment, and payment terms"
      />

      <BookingForm
        initialValues={editingBooking}
        onSubmit={handleSubmit}
        loading={loading}
        onGenerateInvoice={handleGenerateInvoice}
      />
    </div>
  );
};
