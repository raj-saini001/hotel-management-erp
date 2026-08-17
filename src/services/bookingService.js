import { supabase } from '../lib/supabase';
import { formatInvoiceNo } from '../utils/helpers';
import { HOTEL_INFO } from '../utils/constants';
import { activityService } from './activityService';

export const transformBookingFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    bookingRef: row.booking_ref || row.id,
    invoiceNo: row.invoice_no,
    customerName: row.customer_name,
    mobile: row.mobile,
    alternateMobile: row.alternate_mobile || '',
    email: row.email || '',
    address: row.address || '',
    idProofType: row.id_proof_type || 'Aadhar Card',
    idNumber: row.id_number || '',
    bookingDate: row.booking_date,
    checkIn: row.check_in,
    checkOut: row.check_out,
    totalDays: Number(row.total_days) || 1,
    adults: Number(row.adults) || 1,
    children: Number(row.children) || 0,
    roomNumber: row.room_number,
    roomType: row.room_type,
    totalAmount: Number(row.total_amount) || 0,
    advanceAmount: Number(row.advance_amount) || 0,
    remainingAmount: Number(row.remaining_amount) || 0,
    paymentMethod: row.payment_method || 'Cash',
    transactionId: row.transaction_id || '',
    paymentStatus: row.payment_status || 'Pending',
    bookingStatus: row.booking_status || 'Confirmed',
    notes: row.notes || '',
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    payments: Array.isArray(row.payments) ? row.payments : [],
    invoices: Array.isArray(row.invoices) ? row.invoices : [],
  };
};

export const transformBookingToDb = (data) => {
  const total = Number(data.totalAmount) || 0;
  const advance = Number(data.advanceAmount) || 0;
  const remaining = total - advance > 0 ? Number((total - advance).toFixed(2)) : 0;

  const row = {
    customer_name: data.customerName,
    mobile: data.mobile,
    alternate_mobile: data.alternateMobile || null,
    email: data.email || null,
    address: data.address || null,
    id_proof_type: data.idProofType || null,
    id_number: data.idNumber || null,
    booking_date: data.bookingDate || new Date().toISOString().split('T')[0],
    check_in: data.checkIn,
    check_out: data.checkOut,
    total_days: Number(data.totalDays) || 1,
    adults: Number(data.adults) || 1,
    children: Number(data.children) || 0,
    room_number: data.roomNumber,
    room_type: data.roomType,
    total_amount: total,
    advance_amount: advance,
    remaining_amount: remaining,
    payment_method: data.paymentMethod || 'Cash',
    transaction_id: data.transactionId || null,
    payment_status: data.paymentStatus || 'Pending',
    booking_status: data.bookingStatus || 'Confirmed',
    notes: data.notes || null,
  };

  if (data.invoiceNo) row.invoice_no = data.invoiceNo;
  if (data.bookingRef) row.booking_ref = data.bookingRef;
  if (data.createdBy) row.created_by = data.createdBy;

  return row;
};

export const bookingService = {
  getAllBookings: async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, payments(*), invoices(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[bookingService] Error fetching bookings from Supabase:', error);
      throw new Error(error.message || 'Failed to retrieve bookings from database');
    }

    return (data || []).map(transformBookingFromDb);
  },

  getBookingById: async (id) => {
    let query = supabase.from('bookings').select('*, payments(*), invoices(*)');

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUuid) {
      query = query.eq('id', id);
    } else {
      query = query.or(`invoice_no.eq.${id},booking_ref.eq.${id}`);
    }

    const { data, error } = await query.single();
    if (error || !data) {
      console.error('[bookingService] Error fetching single booking:', error);
      throw new Error('Booking not found in database');
    }

    return transformBookingFromDb(data);
  },

  createBooking: async (bookingData) => {
    // Execute atomic creation inside PostgreSQL via Supabase RPC
    const payload = {
      p_customer_name: bookingData.customerName,
      p_mobile: bookingData.mobile,
      p_alternate_mobile: bookingData.alternateMobile || null,
      p_email: bookingData.email || null,
      p_address: bookingData.address || null,
      p_id_proof_type: bookingData.idProofType || 'Aadhar Card',
      p_id_number: bookingData.idNumber || null,
      p_booking_date: bookingData.bookingDate || new Date().toISOString().split('T')[0],
      p_check_in: bookingData.checkIn,
      p_check_out: bookingData.checkOut,
      p_total_days: Number(bookingData.totalDays) || 1,
      p_adults: Number(bookingData.adults) || 1,
      p_children: Number(bookingData.children) || 0,
      p_room_number: bookingData.roomNumber,
      p_room_type: bookingData.roomType,
      p_total_amount: Number(bookingData.totalAmount) || 0,
      p_advance_amount: Number(bookingData.advanceAmount) || 0,
      p_payment_method: bookingData.paymentMethod || 'Cash',
      p_transaction_id: bookingData.transactionId || null,
      p_payment_status: bookingData.paymentStatus || 'Pending',
      p_booking_status: bookingData.bookingStatus || 'Confirmed',
      p_notes: bookingData.notes || null,
    };

    const { data, error } = await supabase.rpc('create_booking_atomic', payload);

    if (error) {
      console.error('[bookingService] Error in atomic booking RPC:', error);
      throw new Error(error.message || 'Failed to create booking in database');
    }

    return transformBookingFromDb(data);
  },

  updateBooking: async (id, bookingData) => {
    const rowPayload = transformBookingToDb(bookingData);
    delete rowPayload.booking_ref; // Retain immutable reference

    const { data: updatedRow, error } = await supabase
      .from('bookings')
      .update(rowPayload)
      .eq('id', id)
      .select()
      .single();

    if (error || !updatedRow) {
      console.error('[bookingService] Error updating booking:', error);
      throw new Error(error?.message || 'Failed to update booking in database');
    }

    // Keep invoice financials & status synchronized with booking update
    try {
      const { data: settingsList } = await supabase
        .from('hotel_settings')
        .select('tax_rate, currency_symbol')
        .limit(1);

      const settingsData = settingsList?.[0];
      const taxRate = Number(settingsData?.tax_rate) || 18;

      const subtotal = Number(updatedRow.total_amount) || 0;
      const cgst = Number((subtotal * ((taxRate / 2) / 100)).toFixed(2));
      const sgst = Number((subtotal * ((taxRate / 2) / 100)).toFixed(2));
      const totalWithTax = Number((subtotal + cgst + sgst).toFixed(2));
      const advancePaid = Number(updatedRow.advance_amount) || 0;
      const balanceDue = Number((totalWithTax - advancePaid).toFixed(2));

      await supabase
        .from('invoices')
        .update({
          subtotal,
          tax_rate: taxRate,
          cgst,
          sgst,
          tax_amount: Number((cgst + sgst).toFixed(2)),
          total_amount: totalWithTax,
          advance_paid: advancePaid,
          balance_due: balanceDue > 0 ? balanceDue : 0,
          payment_status: updatedRow.payment_status,
        })
        .eq('booking_id', id);
    } catch (invErr) {
      console.warn('[bookingService] Non-fatal invoice sync notice:', invErr);
    }

    // Audit Log
    await activityService.logActivity(
      'Booking Updated',
      `Updated details/status of Booking ${updatedRow.invoice_no} (${updatedRow.customer_name})`,
      undefined,
      'booking',
      updatedRow.id
    );

    return transformBookingFromDb(updatedRow);
  },

  deleteBooking: async (id) => {
    if (!id) {
      throw new Error('Invalid booking identifier');
    }

    // Get target info for activity logging
    const { data: targetList } = await supabase
      .from('bookings')
      .select('id, invoice_no, customer_name')
      .eq('id', id)
      .limit(1);

    const target = targetList?.[0];

    const { data: deletedRows, error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('[bookingService] Error deleting booking:', error);
      throw new Error(error.message || 'Failed to delete booking record');
    }

    if (!deletedRows || deletedRows.length === 0) {
      throw new Error('Access denied: You do not have permission to delete this booking, or the record does not exist.');
    }

    if (target) {
      await activityService.logActivity(
        'Booking Deleted',
        `Deleted Booking record ${target.invoice_no} (${target.customer_name})`,
        undefined,
        'booking',
        target.id
      );
    }

    return true;
  },


  getStats: async () => {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*');

    if (error || !bookings) {
      console.error('[bookingService] Error computing stats:', error);
      return {
        todayCount: 0,
        upcomingCount: 0,
        completedCount: 0,
        cancelledCount: 0,
        pendingPaymentsCount: 0,
        pendingAmountTotal: 0,
        totalRevenue: 0,
        monthlyRevenue: 0,
        yearBookingsCount: 0,
        totalBookingsCount: 0,
      };
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentYearStr = String(now.getFullYear());
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const todayBookings = bookings.filter((b) => b.check_in === today || b.booking_date === today);
    const upcomingBookings = bookings.filter(
      (b) => b.booking_status === 'Confirmed' && (b.check_in || '') >= today
    );
    const completedBookings = bookings.filter((b) => b.booking_status === 'Checked Out');
    const cancelledBookings = bookings.filter((b) => b.booking_status === 'Cancelled');
    const pendingPayments = bookings.filter(
      (b) => b.payment_status === 'Pending' || b.payment_status === 'Partial'
    );

    const activeBookings = bookings.filter((b) => b.booking_status !== 'Cancelled');
    const totalRevenue = activeBookings.reduce(
      (sum, b) =>
        sum +
        (Number(b.advance_amount) || 0) +
        (b.payment_status === 'Paid' ? Number(b.remaining_amount) || 0 : 0),
      0
    );

    const monthlyRevenue = activeBookings
      .filter((b) => (b.check_in || b.booking_date || '').startsWith(currentMonthStr))
      .reduce(
        (sum, b) =>
          sum +
          (Number(b.advance_amount) || 0) +
          (b.payment_status === 'Paid' ? Number(b.remaining_amount) || 0 : 0),
        0
      );

    const yearBookingsCount = bookings.filter((b) =>
      (b.check_in || b.booking_date || '').startsWith(currentYearStr)
    ).length;

    const pendingAmountTotal = pendingPayments.reduce(
      (sum, b) => sum + (Number(b.remaining_amount) || 0),
      0
    );

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

