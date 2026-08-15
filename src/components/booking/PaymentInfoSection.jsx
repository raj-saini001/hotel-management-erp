import React from 'react';
import { DollarSign, CreditCard, CheckCircle2, FileText } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { PAYMENT_METHODS, PAYMENT_STATUSES, BOOKING_STATUSES } from '../../utils/constants';
import { useSettings } from '../../hooks/useSettings';

export const PaymentInfoSection = ({ register, errors }) => {
  const { settings } = useSettings();
  const symbol = settings?.currencySymbol || '$';

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
          3. Payment & Status Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label={`Total Amount (${symbol})`}
          type="number"
          required
          placeholder="0.00"
          icon={DollarSign}
          error={errors.totalAmount?.message}
          {...register('totalAmount')}
        />

        <Input
          label={`Advance Paid (${symbol})`}
          type="number"
          placeholder="0.00"
          icon={DollarSign}
          error={errors.advanceAmount?.message}
          {...register('advanceAmount')}
        />

        <Input
          label={`Remaining Balance (${symbol})`}
          type="number"
          readOnly
          className="bg-slate-100 dark:bg-slate-800 font-bold text-rose-600 dark:text-rose-400"
          error={errors.remainingAmount?.message}
          {...register('remainingAmount', { valueAsNumber: true })}
        />

        <Select
          label="Payment Method"
          required
          options={PAYMENT_METHODS}
          icon={CreditCard}
          error={errors.paymentMethod?.message}
          {...register('paymentMethod')}
        />

        <Input
          label="Transaction ID / Ref"
          placeholder="e.g. TXN-998811 (Optional)"
          icon={FileText}
          error={errors.transactionId?.message}
          {...register('transactionId')}
        />

        <Select
          label="Payment Status"
          required
          options={Object.values(PAYMENT_STATUSES)}
          icon={CheckCircle2}
          error={errors.paymentStatus?.message}
          {...register('paymentStatus')}
        />

        <Select
          label="Booking Status"
          required
          options={Object.values(BOOKING_STATUSES)}
          icon={CheckCircle2}
          error={errors.bookingStatus?.message}
          {...register('bookingStatus')}
        />

        <div className="md:col-span-2">
          <Input
            label="Additional Notes / Requests"
            placeholder="e.g. Ocean view, early check-in, extra bed"
            error={errors.notes?.message}
            {...register('notes')}
          />
        </div>
      </div>
    </div>
  );
};
