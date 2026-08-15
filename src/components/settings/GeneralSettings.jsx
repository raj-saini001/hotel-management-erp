import React from 'react';
import { Building2, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { Input } from '../common/Input';

export const GeneralSettings = ({ register, errors }) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
          General Hotel Profile
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Hotel / Property Name" required icon={Building2} error={errors.hotelName?.message} {...register('hotelName')} />
        <Input label="Tagline / Slogan" icon={Building2} error={errors.tagline?.message} {...register('tagline')} />
        <Input label="Reservations Phone" required icon={Phone} error={errors.phone?.message} {...register('phone')} />
        <Input label="Official Email" required type="email" icon={Mail} error={errors.email?.message} {...register('email')} />
      </div>

      <Input label="Physical Property Address" required icon={MapPin} error={errors.address?.message} {...register('address')} />
    </div>
  );
};
