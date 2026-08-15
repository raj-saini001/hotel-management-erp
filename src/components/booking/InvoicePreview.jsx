import React from 'react';
import { Building2, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { HOTEL_INFO } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/dateFormatter';
import { downloadInvoicePdf } from '../../utils/invoiceGenerator';
import { useSettings } from '../../hooks/useSettings';

export const InvoicePreview = ({ booking }) => {
  const { settings } = useSettings();
  if (!booking) return null;

  const hotelName = settings?.hotelName || HOTEL_INFO.name;
  const tagline = settings?.tagline || HOTEL_INFO.tagline;
  const address = settings?.address || HOTEL_INFO.address;
  const gstin = settings?.gstin || HOTEL_INFO.gstin;
  const email = settings?.email || HOTEL_INFO.email;
  const taxRate = Number(settings?.taxRate ?? HOTEL_INFO.taxRate);

  const symbol = settings?.currencySymbol || '$';
  const subtotal = Number(booking.totalAmount) || 0;
  const halfTaxRate = taxRate / 2;
  const cgst = subtotal * (halfTaxRate / 100);
  const sgst = subtotal * (halfTaxRate / 100);
  const grandTotal = subtotal + cgst + sgst;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    downloadInvoicePdf('printable-invoice-card', `${booking.invoiceNo}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between no-print p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Tax Invoice Preview</h3>
          <p className="text-xs text-slate-500">Ready for instant print or high-res PDF download</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon={Printer} onClick={handlePrint}>
            Print Invoice
          </Button>
          <Button variant="primary" size="md" icon={Download} onClick={handleDownloadPdf}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Printable Invoice Document Card */}
      <div
        id="printable-invoice-card"
        className="p-8 sm:p-12 bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-lg max-w-4xl mx-auto space-y-8"
      >
        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-brand-600 text-white shadow-md">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">{hotelName}</h1>
              <p className="text-xs text-slate-500">{tagline}</p>
              <p className="text-xs text-slate-500 mt-1">{address}</p>
              <p className="text-xs text-slate-500">
                GSTIN: <span className="font-semibold text-slate-700">{gstin}</span>
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold rounded-full border border-brand-200 inline-block mb-2">
              TAX INVOICE
            </span>
            <h2 className="text-lg font-mono font-bold text-brand-600">{booking.invoiceNo}</h2>
            <p className="text-xs text-slate-500 mt-1">Date: {formatDate(booking.bookingDate || booking.createdAt)}</p>
            <p className="text-xs text-slate-500">
              Payment Status:{' '}
              <span className="font-bold text-emerald-600">{booking.paymentStatus}</span>
            </p>
          </div>
        </div>

        {/* Billed To & Stay Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Billed To (Guest)</h4>
            <p className="text-base font-bold text-slate-900">{booking.customerName}</p>
            <p className="text-xs text-slate-600 mt-1">Phone: {booking.mobile}</p>
            <p className="text-xs text-slate-600">Email: {booking.email}</p>
            <p className="text-xs text-slate-600">Address: {booking.address}</p>
            <p className="text-xs text-slate-500 mt-1">
              ID: {booking.idProofType} - {booking.idNumber}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Reservation Details</h4>
            <p className="text-xs text-slate-700">
              Room Number: <span className="font-bold text-slate-900">{booking.roomNumber}</span>
            </p>
            <p className="text-xs text-slate-700">
              Room Type: <span className="font-semibold text-slate-900">{booking.roomType}</span>
            </p>
            <p className="text-xs text-slate-700 mt-1">
              Check-In: <span className="font-semibold text-slate-900">{formatDate(booking.checkIn)}</span>
            </p>
            <p className="text-xs text-slate-700">
              Check-Out: <span className="font-semibold text-slate-900">{formatDate(booking.checkOut)}</span>
            </p>
            <p className="text-xs text-slate-700">
              Total Stay: <span className="font-bold text-brand-600">{booking.totalDays} Night(s)</span>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-xs font-bold uppercase text-slate-500">
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 text-center">Nights</th>
                <th className="py-3 px-2 text-right">Rate / Night</th>
                <th className="py-3 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-4 px-2">
                  <p className="font-bold text-slate-900">{booking.roomType} Accommodation</p>
                  <p className="text-xs text-slate-500">
                    Room {booking.roomNumber} ({booking.adults} Adults, {booking.children} Children)
                  </p>
                </td>
                <td className="py-4 px-2 text-center font-semibold">{booking.totalDays}</td>
                <td className="py-4 px-2 text-right font-semibold">
                  {formatCurrency(subtotal / (booking.totalDays || 1), symbol)}
                </td>
                <td className="py-4 px-2 text-right font-bold text-slate-900">
                  {formatCurrency(subtotal, symbol)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Breakdown & Tax Calculations */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
          {/* QR Code & Payment Method */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="w-16 h-16 bg-slate-900 p-1.5 rounded-lg flex items-center justify-center">
                <div className="w-full h-full bg-white flex items-center justify-center font-mono text-[9px] font-bold text-center">
                  [ QR CODE ]
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Scan & Pay Online</p>
                <p className="text-[11px] text-slate-500">Method: {booking.paymentMethod}</p>
                {booking.transactionId && (
                  <p className="text-[10px] text-slate-400 font-mono">Ref: {booking.transactionId}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" /> GST Compliant Digital Receipt
            </div>
          </div>

          {/* Totals Box */}
          <div className="w-full sm:w-72 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(subtotal, symbol)}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-xs">
              <span>CGST ({halfTaxRate}%):</span>
              <span>{formatCurrency(cgst, symbol)}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-xs">
              <span>SGST ({halfTaxRate}%):</span>
              <span>{formatCurrency(sgst, symbol)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-lg text-slate-900">
              <span>Grand Total:</span>
              <span className="text-brand-600">{formatCurrency(grandTotal, symbol)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 pt-1">
              <span>Advance Paid:</span>
              <span className="font-bold text-emerald-600">{formatCurrency(booking.advanceAmount, symbol)}</span>
            </div>
            <div className="flex justify-between text-xs text-rose-600 font-bold pt-1 border-t border-dashed border-slate-200">
              <span>Balance Due:</span>
              <span>{formatCurrency(booking.remainingAmount, symbol)}</span>
            </div>
          </div>
        </div>

        {/* Footer Authorization */}
        <div className="flex items-end justify-between pt-12 border-t border-slate-200 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-800">Thank you for staying at {hotelName}!</p>
            <p className="text-[11px] text-slate-400">For inquiries, contact {email}</p>
          </div>
          <div className="text-center space-y-8">
            <div className="font-serif italic text-slate-700 text-sm font-bold border-b border-slate-300 pb-1">
              Vijay Shree (Manager)
            </div>
            <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};
