import React from 'react';
import { User, Phone, Mail, MapPin, CreditCard, FileText } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { ID_PROOF_TYPES } from '../../utils/constants';

export const CustomerInfoSection = ({ register, errors }) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
          1. Customer Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          label="Customer Name"
          required
          placeholder="e.g. John Doe"
          icon={User}
          error={errors.customerName?.message}
          {...register('customerName')}
        />

        <Input
          label="Mobile Number"
          required
          placeholder="e.g. +1 555-0192"
          icon={Phone}
          error={errors.mobile?.message}
          {...register('mobile')}
        />

        <Input
          label="Alternate Mobile"
          placeholder="e.g. +1 555-9922 (Optional)"
          icon={Phone}
          error={errors.alternateMobile?.message}
          {...register('alternateMobile')}
        />

        <Input
          label="Email Address"
          required
          type="email"
          placeholder="e.g. john@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Select
          label="ID Proof Type"
          required
          options={ID_PROOF_TYPES}
          icon={CreditCard}
          error={errors.idProofType?.message}
          {...register('idProofType')}
        />

        <Input
          label="ID Proof Number"
          required
          placeholder="e.g. Pass/DL/Aadhar Number"
          icon={FileText}
          error={errors.idNumber?.message}
          {...register('idNumber')}
        />
      </div>

      <Input
        label="Full Physical Address"
        required
        placeholder="e.g. 123 Main Street, City, Country"
        icon={MapPin}
        error={errors.address?.message}
        {...register('address')}
      />
    </div>
  );
};
