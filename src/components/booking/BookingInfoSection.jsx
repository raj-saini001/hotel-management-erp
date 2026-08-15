import React from 'react';
import { Calendar, Users, BedDouble, Home } from 'lucide-react';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { DatePicker } from '../common/DatePicker';
import { ROOM_TYPES } from '../../utils/constants';

export const BookingInfoSection = ({ register, errors, setValue, watch }) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <BedDouble className="w-5 h-5 text-brand-600 dark:text-brand-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
          2. Stay & Room Details
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DatePicker
          label="Booking Date"
          required
          error={errors.bookingDate?.message}
          {...register('bookingDate')}
        />

        <DatePicker
          label="Check-In Date"
          required
          error={errors.checkIn?.message}
          {...register('checkIn')}
        />

        <DatePicker
          label="Check-Out Date"
          required
          error={errors.checkOut?.message}
          {...register('checkOut')}
        />

        <Input
          label="Total Stay Days"
          type="number"
          readOnly
          className="bg-slate-100 dark:bg-slate-800 font-bold text-brand-600"
          error={errors.totalDays?.message}
          {...register('totalDays', { valueAsNumber: true })}
        />

        <Input
          label="Adults Count"
          type="number"
          required
          min="1"
          icon={Users}
          error={errors.adults?.message}
          {...register('adults')}
        />

        <Input
          label="Children Count"
          type="number"
          min="0"
          icon={Users}
          error={errors.children?.message}
          {...register('children')}
        />

        <Input
          label="Room Number"
          required
          placeholder="e.g. 302, 501"
          icon={Home}
          error={errors.roomNumber?.message}
          {...register('roomNumber')}
        />

        <Select
          label="Room Category"
          required
          options={ROOM_TYPES}
          icon={BedDouble}
          error={errors.roomType?.message}
          {...register('roomType')}
        />
      </div>
    </div>
  );
};
