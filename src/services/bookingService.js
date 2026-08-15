import { delay } from './api';
import { getStorageItem, setStorageItem } from './mockData';
import { formatInvoiceNo } from '../utils/helpers';
import { HOTEL_INFO } from '../utils/constants';
import { activityService } from './activityService';

export const bookingService = {
  getAllBookings: async () => {
    await delay(300);
    const bookings = getStorageItem('hotel_bookings', []);
    return [...bookings].sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate));
  },

  getBookingById: async (id) => {
    await delay(200);
    const bookings = getStorageItem('hotel_bookings', []);
    const booking = bookings.find((b) => b.id === id || b.invoiceNo === id);
    if (!booking) throw new Error('Booking not found');
    return booking;
  },

  createBooking: async (bookingData) => {
    await delay(400);
    const bookings = getStorageItem('hotel_bookings', []);
    const settings = getStorageItem('hotel_settings', HOTEL_INFO);
    const prefix = settings?.invoicePrefix || HOTEL_INFO.invoicePrefix || 'INV-GS-';

    const nextSeq = 1000 + bookings.length + 1;
    const newId = `BK-${nextSeq}`;
    const invoiceNo = formatInvoiceNo(nextSeq, prefix);

    const newBooking = {
      ...bookingData,
      id: newId,
      invoiceNo,
      createdAt: new Date().toISOString(),
    };

    const updated = [newBooking, ...bookings];
    setStorageItem('hotel_bookings', updated);

    await activityService.logActivity(
      'Booking Added',
      `Created Booking ${invoiceNo} for ${bookingData.customerName} (Room ${bookingData.roomNumber})`
    );

    return newBooking;
  },

  updateBooking: async (id, bookingData) => {
    await delay(300);
    const bookings = getStorageItem('hotel_bookings', []);
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    const updatedBooking = { ...bookings[index], ...bookingData };
    bookings[index] = updatedBooking;
    setStorageItem('hotel_bookings', bookings);

    await activityService.logActivity(
      'Booking Updated',
      `Updated details/status of Booking ${updatedBooking.invoiceNo} (${updatedBooking.customerName})`
    );

    return updatedBooking;
  },

  deleteBooking: async (id) => {
    await delay(300);
    const bookings = getStorageItem('hotel_bookings', []);
    const target = bookings.find((b) => b.id === id);
    const filtered = bookings.filter((b) => b.id !== id);
    setStorageItem('hotel_bookings', filtered);

    if (target) {
      await activityService.logActivity(
        'Booking Deleted',
        `Deleted Booking record ${target.invoiceNo} (${target.customerName})`
      );
    }
    return true;
  },

  getStats: async () => {
    await delay(200);
    const bookings = getStorageItem('hotel_bookings', []);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentYearStr = String(now.getFullYear());
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const todayBookings = bookings.filter((b) => b.checkIn === today || b.bookingDate === today);
    const upcomingBookings = bookings.filter(
      (b) => b.bookingStatus === 'Confirmed' && new Date(b.checkIn) >= new Date(today)
    );
    const completedBookings = bookings.filter((b) => b.bookingStatus === 'Checked Out');
    const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'Cancelled');
    const pendingPayments = bookings.filter((b) => b.paymentStatus === 'Pending' || b.paymentStatus === 'Partial');

    const activeBookings = bookings.filter((b) => b.bookingStatus !== 'Cancelled');
    const totalRevenue = activeBookings.reduce(
      (sum, b) => sum + (Number(b.advanceAmount) || 0) + (b.paymentStatus === 'Paid' ? Number(b.remainingAmount) || 0 : 0),
      0
    );

    const monthlyRevenue = activeBookings
      .filter((b) => (b.checkIn || b.bookingDate || '').startsWith(currentMonthStr))
      .reduce(
        (sum, b) => sum + (Number(b.advanceAmount) || 0) + (b.paymentStatus === 'Paid' ? Number(b.remainingAmount) || 0 : 0),
        0
      );

    const yearBookingsCount = bookings.filter((b) =>
      (b.checkIn || b.bookingDate || '').startsWith(currentYearStr)
    ).length;

    const pendingAmountTotal = pendingPayments.reduce((sum, b) => sum + (Number(b.remainingAmount) || 0), 0);

    return {
      todayCount: todayBookings.length,
      upcomingCount: upcomingBookings.length,
      completedCount: completedBookings.length,
      cancelledCount: cancelledBookings.length,
      pendingPaymentsCount: pendingPayments.length,
      pendingAmountTotal,
      totalRevenue,
      monthlyRevenue: monthlyRevenue || totalRevenue,
      yearBookingsCount: yearBookingsCount || bookings.length,
      totalBookingsCount: bookings.length,
    };
  },
};
