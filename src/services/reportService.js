import { delay } from './api';
import { getStorageItem } from './mockData';

export const reportService = {
  getReportData: async ({ type = 'monthly', startDate, endDate } = {}) => {
    await delay(300);
    const bookings = getStorageItem('hotel_bookings', []);

    let filtered = [...bookings];
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const yearStr = String(now.getFullYear());

    if (startDate && endDate) {
      filtered = filtered.filter((b) => {
        const date = b.checkIn || b.bookingDate;
        return date >= startDate && date <= endDate;
      });
    } else if (type === 'daily') {
      filtered = filtered.filter((b) => (b.checkIn || b.bookingDate) === todayStr);
    } else if (type === 'monthly') {
      filtered = filtered.filter((b) => (b.checkIn || b.bookingDate || '').startsWith(monthStr));
    } else if (type === 'yearly') {
      filtered = filtered.filter((b) => (b.checkIn || b.bookingDate || '').startsWith(yearStr));
    }

    const totalRevenue = filtered
      .filter((b) => b.bookingStatus !== 'Cancelled')
      .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

    const paidRevenue = filtered
      .filter((b) => b.bookingStatus !== 'Cancelled')
      .reduce((sum, b) => sum + (Number(b.advanceAmount) || 0) + (b.paymentStatus === 'Paid' ? Number(b.remainingAmount) || 0 : 0), 0);

    const cancelledCount = filtered.filter((b) => b.bookingStatus === 'Cancelled').length;

    return {
      type,
      totalBookings: filtered.length,
      cancelledCount,
      totalRevenue,
      paidRevenue,
      pendingRevenue: totalRevenue - paidRevenue,
      bookings: filtered,
    };
  },
};
