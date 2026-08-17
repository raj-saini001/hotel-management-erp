import { supabase } from '../lib/supabase';

export const transformPaymentFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    bookingId: row.booking_id,
    amount: Number(row.amount) || 0,
    paymentMethod: row.payment_method || 'Cash',
    paymentDate: row.payment_date,
    transactionRef: row.transaction_ref || '',
    notes: row.notes || '',
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
};

export const paymentService = {
  getPaymentsByBookingId: async (bookingId) => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .order('payment_date', { ascending: false });

    if (error) {
      console.error('[paymentService] Error fetching payments:', error);
      throw new Error(error.message || 'Failed to fetch payments');
    }

    return (data || []).map(transformPaymentFromDb);
  },

  recordPayment: async ({ bookingId, amount, paymentMethod, transactionRef, notes }) => {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        amount: Number(amount),
        payment_method: paymentMethod || 'Cash',
        payment_date: new Date().toISOString().split('T')[0],
        transaction_ref: transactionRef || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('[paymentService] Error recording payment:', error);
      throw new Error(error.message || 'Failed to record payment');
    }

    return transformPaymentFromDb(data);
  },
};
