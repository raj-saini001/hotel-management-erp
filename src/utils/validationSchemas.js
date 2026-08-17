import { z } from 'zod';

export const bookingFormSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  mobile: z.string().min(7, 'Valid mobile number required'),
  alternateMobile: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Full address is required'),
  idProofType: z.string().min(1, 'Please select an ID proof type'),
  idNumber: z.string().min(3, 'ID proof number is required'),

  bookingDate: z.string().min(1, 'Booking date is required'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  totalDays: z.coerce.number().min(1, 'At least 1 day stay required'),
  adults: z.coerce.number().min(1, 'Minimum 1 adult required'),
  children: z.coerce.number().min(0, 'Children count cannot be negative'),
  roomNumber: z.string().min(1, 'Room number is required'),
  roomType: z.string().min(1, 'Please select room type'),

  totalAmount: z.coerce.number().min(0, 'Total amount must be 0 or greater'),
  advanceAmount: z.coerce.number().min(0, 'Advance cannot be negative'),
  remainingAmount: z.coerce.number(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  transactionId: z.string().optional().or(z.literal('')),
  paymentStatus: z.string().min(1, 'Payment status is required'),
  bookingStatus: z.string().min(1, 'Booking status is required'),
  notes: z.string().optional().or(z.literal('')),
}).refine((data) => new Date(data.checkOut) >= new Date(data.checkIn), {
  message: 'Check-out date must be on or after check-in date',
  path: ['checkOut'],
}).refine((data) => Number(data.advanceAmount) <= Number(data.totalAmount), {
  message: 'Advance amount cannot exceed total amount',
  path: ['advanceAmount'],
});


export const loginSchema = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  rememberMe: z.boolean().optional(),
});

export const adminFormSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1, 'Select a role'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  status: z.enum(['Active', 'Inactive']),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});

export const hotelSettingsSchema = z.object({
  hotelName: z.string().min(2, 'Hotel name is required'),
  tagline: z.string().optional(),
  phone: z.string().min(5, 'Contact phone is required'),
  email: z.string().email('Invalid email'),
  address: z.string().min(5, 'Address is required'),
  gstin: z.string().min(5, 'GSTIN is required'),
  invoicePrefix: z.string().min(2, 'Invoice prefix is required'),
  taxRate: z.coerce.number().min(0).max(100),
  currencySymbol: z.string().min(1),
  emailAlerts: z.boolean().optional(),
});
