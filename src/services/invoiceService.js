import { supabase } from '../lib/supabase';

export const transformInvoiceFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    invoiceNo: row.invoice_no,
    bookingId: row.booking_id,
    invoiceDate: row.invoice_date,
    subtotal: Number(row.subtotal) || 0,
    taxRate: Number(row.tax_rate) || 18,
    cgst: Number(row.cgst) || 0,
    sgst: Number(row.sgst) || 0,
    taxAmount: Number(row.tax_amount) || 0,
    totalAmount: Number(row.total_amount) || 0,
    advancePaid: Number(row.advance_paid) || 0,
    balanceDue: Number(row.balance_due) || 0,
    currency: row.currency || '$',
    paymentStatus: row.payment_status || 'Pending',
    generatedBy: row.generated_by,
    createdAt: row.created_at,
  };
};

export const invoiceService = {
  getInvoiceByNumber: async (invoiceNo) => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, bookings(*)')
      .eq('invoice_no', invoiceNo)
      .single();

    if (error || !data) {
      console.error('[invoiceService] Error fetching invoice:', error);
      throw new Error('Invoice not found in database');
    }

    return transformInvoiceFromDb(data);
  },

  getInvoicesByBookingId: async (bookingId) => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[invoiceService] Error fetching invoices:', error);
      throw new Error(error.message || 'Failed to fetch invoices');
    }

    return (data || []).map(transformInvoiceFromDb);
  },
};
