import React, { createContext, useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import toast from 'react-hot-toast';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      const statsData = await bookingService.getStats();
      setBookings(data);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load bookings:', err);
      toast.error('Failed to load booking data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const addBooking = async (bookingData) => {
    try {
      const newBooking = await bookingService.createBooking(bookingData);
      toast.success(`Booking ${newBooking.invoiceNo} created successfully!`);
      await fetchBookings();
      return newBooking;
    } catch (err) {
      toast.error(err.message || 'Error creating booking');
      throw err;
    }
  };

  const updateBooking = async (id, bookingData) => {
    try {
      const updated = await bookingService.updateBooking(id, bookingData);
      toast.success(`Booking ${updated.invoiceNo} updated successfully!`);
      await fetchBookings();
      return updated;
    } catch (err) {
      toast.error(err.message || 'Error updating booking');
      throw err;
    }
  };

  const deleteBooking = async (id) => {
    try {
      await bookingService.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      toast.success('Booking deleted successfully');
      await fetchBookings();
    } catch (err) {
      toast.error(err.message || 'Error deleting booking');
      throw err;
    }
  };


  return (
    <BookingContext.Provider
      value={{
        bookings,
        stats,
        loading,
        refreshBookings: fetchBookings,
        addBooking,
        updateBooking,
        deleteBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
