import { supabase } from '../lib/supabase';
import { transformBookingFromDb } from './bookingService';

export const reportService = {
  getReportData: async ({ type = 'monthly', startDate, endDate } = {}) => {
    let query = supabase.from('bookings').select('*, payments(*), invoices(*)').order('check_in', { ascending: false });

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const yearStr = String(now.getFullYear());

    if (startDate && endDate) {
      query = query.gte('check_in', startDate).lte('check_in', endDate);
    } else if (type === 'daily') {
      query = query.eq('check_in', todayStr);
    } else if (type === 'monthly') {
      query = query.gte('check_in', `${monthStr}-01`).lte('check_in', `${monthStr}-31`);
    } else if (type === 'yearly') {
      query = query.gte('check_in', `${yearStr}-01-01`).lte('check_in', `${yearStr}-12-31`);
    }

    const { data: rawBookings, error } = await query;

    if (error) {
      console.error('[reportService] Error fetching report data from Supabase:', error);
      throw new Error(error.message || 'Failed to generate report statement');
    }

    const bookings = (rawBookings || []).map(transformBookingFromDb);

    const totalRevenue = bookings
      .filter((b) => b.bookingStatus !== 'Cancelled')
      .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);

    const paidRevenue = bookings
      .filter((b) => b.bookingStatus !== 'Cancelled')
      .reduce(
        (sum, b) =>
          sum +
          (Number(b.advanceAmount) || 0) +
          (b.paymentStatus === 'Paid' ? Number(b.remainingAmount) || 0 : 0),
        0
      );

    const cancelledCount = bookings.filter((b) => b.bookingStatus === 'Cancelled').length;

    return {
      type,
      totalBookings: bookings.length,
      cancelledCount,
      totalRevenue,
      paidRevenue,
      pendingRevenue: totalRevenue - paidRevenue > 0 ? totalRevenue - paidRevenue : 0,
      bookings,
    };
  },
};
