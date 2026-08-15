import React from 'react';
import { FileText, DollarSign, Percent } from 'lucide-react';
import { Input } from '../common/Input';

export const TaxBillingSettings = ({ register, errors }) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
          GSTIN & Invoice Tax Configuration
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input label="Hotel GSTIN Number" required icon={FileText} error={errors.gstin?.message} {...register('gstin')} />
        <Input label="Invoice Number Prefix" required icon={FileText} error={errors.invoicePrefix?.message} {...register('invoicePrefix')} />
        <Input label="Total Tax Rate (%)" type="number" required icon={Percent} error={errors.taxRate?.message} {...register('taxRate')} />
        <Input label="Currency Symbol" required icon={DollarSign} error={errors.currencySymbol?.message} {...register('currencySymbol')} />
      </div>
    </div>
  );
};
