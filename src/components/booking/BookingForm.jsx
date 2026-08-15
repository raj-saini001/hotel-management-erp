import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, RotateCcw, Printer, FileText } from 'lucide-react';
import { bookingFormSchema } from '../../utils/validationSchemas';
import { CustomerInfoSection } from './CustomerInfoSection';
import { BookingInfoSection } from './BookingInfoSection';
import { PaymentInfoSection } from './PaymentInfoSection';
import { Button } from '../common/Button';
import { calculateDays, getTodayIso, getTomorrowIso } from '../../utils/dateFormatter';
import { ROOM_TYPES } from '../../utils/constants';

export const BookingForm = ({ initialValues, onSubmit, loading = false, onGenerateInvoice }) => {
  const defaultValues = initialValues || {
    customerName: '',
    mobile: '',
    alternateMobile: '',
    email: '',
    address: '',
    idProofType: 'Aadhar Card',
    idNumber: '',
    bookingDate: getTodayIso(),
    checkIn: getTodayIso(),
    checkOut: getTomorrowIso(),
    totalDays: 1,
    adults: 2,
    children: 0,
    roomNumber: '101',
    roomType: 'Deluxe Suite',
    totalAmount: 200,
    advanceAmount: 100,
    remainingAmount: 100,
    paymentMethod: 'Card',
    transactionId: '',
    paymentStatus: 'Partial',
    bookingStatus: 'Confirmed',
    notes: '',
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  });

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const totalAmount = watch('totalAmount');
  const advanceAmount = watch('advanceAmount');
  const roomType = watch('roomType');
  const totalDays = watch('totalDays');

  // Auto calculate total stay days
  useEffect(() => {
    if (checkIn && checkOut) {
      const days = calculateDays(checkIn, checkOut);
      setValue('totalDays', days);
    }
  }, [checkIn, checkOut, setValue]);

  // Auto calculate total amount from room base price if not editing
  useEffect(() => {
    if (!initialValues && roomType && totalDays) {
      const room = ROOM_TYPES.find((r) => r.name === roomType || r.id === roomType);
      if (room && room.basePrice) {
        const calculated = room.basePrice * totalDays;
        setValue('totalAmount', calculated);
      }
    }
  }, [roomType, totalDays, initialValues, setValue]);

  // Auto calculate remaining balance
  useEffect(() => {
    const total = Number(totalAmount) || 0;
    const advance = Number(advanceAmount) || 0;
    const rem = total - advance;
    setValue('remainingAmount', rem > 0 ? rem : 0);
  }, [totalAmount, advanceAmount, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CustomerInfoSection register={register} errors={errors} />
      <BookingInfoSection register={register} errors={errors} setValue={setValue} watch={watch} />
      <PaymentInfoSection register={register} errors={errors} />

      {/* Form Action Controls */}
      <div className="flex flex-wrap items-center justify-end gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-card">
        <Button
          variant="ghost"
          size="md"
          type="button"
          onClick={() => reset(defaultValues)}
          icon={RotateCcw}
        >
          Reset Form
        </Button>

        {onGenerateInvoice && (
          <Button
            variant="outline"
            size="md"
            type="button"
            onClick={handleSubmit((data) => onGenerateInvoice(data))}
            icon={FileText}
          >
            Generate Invoice
          </Button>
        )}

        <Button variant="primary" size="md" type="submit" loading={loading} icon={Save}>
          Save Booking Record
        </Button>
      </div>
    </form>
  );
};
