import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/dateFormatter';
import { useSettings } from '../../hooks/useSettings';
import { User, Phone, Mail, MapPin, Calendar, CreditCard, Download, FileText } from 'lucide-react';

export const BookingDetailsModal = ({ isOpen, onClose, booking, onDownloadPdf }) => {
  const { settings } = useSettings();
  const symbol = settings?.currencySymbol || '$';

  if (!booking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Booking Details - ${booking.invoiceNo}`}
      subtitle={`Created on ${formatDate(booking.createdAt)}`}
      maxWidth="max-w-3xl"
      footer={
        <>
          <Button variant="outline" size="md" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="md" icon={Download} onClick={() => onDownloadPdf(booking)}>
            Download PDF Invoice
          </Button>
        </>
      }
    >
      <div className="space-y-6 text-sm">
        {/* Status Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block">Booking Status</span>
            <div className="mt-1">
              <Badge status={booking.bookingStatus} />
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block">Payment Status</span>
            <div className="mt-1">
              <Badge status={booking.paymentStatus} />
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block">Room Number</span>
            <p className="font-extrabold text-brand-600 dark:text-brand-400 text-base mt-0.5">
              Room {booking.roomNumber} ({booking.roomType})
            </p>
          </div>
        </div>

        {/* Guest & ID Details */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <User className="w-4 h-4 text-brand-600" /> Guest Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400">Guest Name</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{booking.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Contact Number</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{booking.mobile}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Email Address</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{booking.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">ID Verification</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {booking.idProofType} ({booking.idNumber})
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-slate-400">Address</p>
              <p className="text-slate-700 dark:text-slate-300">{booking.address}</p>
            </div>
          </div>
        </div>

        {/* Stay Duration */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-600" /> Stay Dates & Capacity
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs text-slate-400">Check-In</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Check-Out</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">{formatDate(booking.checkOut)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Duration</p>
              <p className="font-bold text-brand-600 dark:text-brand-400">{booking.totalDays} Night(s)</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Guests</p>
              <p className="font-bold text-slate-900 dark:text-slate-100">
                {booking.adults} Adult(s), {booking.children} Child
              </p>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Payment & Billing Breakdown
          </h4>
          <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Room Charges:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(booking.totalAmount, symbol)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Advance Paid:</span>
              <span className="font-semibold text-emerald-600">{formatCurrency(booking.advanceAmount, symbol)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 font-extrabold text-base">
              <span className="text-slate-900 dark:text-slate-100">Balance Remaining Due:</span>
              <span className="text-rose-600 dark:text-rose-400">{formatCurrency(booking.remainingAmount, symbol)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
