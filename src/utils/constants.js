export const HOTEL_INFO = {
  name: 'Grand Stay Resort & Spa',
  tagline: 'Luxury Living & Premium Hospitality',
  address: '104 Beachfront Avenue, Suite 500, Palms Bay',
  phone: '+1 (800) 555-4726',
  email: 'reservations@grandstay.com',
  website: 'www.grandstayresorts.com',
  gstin: '22AAAAA0000A1Z5',
  invoicePrefix: 'INV-GS-',
  taxRate: 18, // 18% GST (9% CGST + 9% SGST)
  currencySymbol: '$',
};

export const ROOM_TYPES = [
  { id: 'standard', name: 'Standard Room', basePrice: 120, capacity: '2 Adults' },
  { id: 'deluxe', name: 'Deluxe Suite', basePrice: 180, capacity: '2 Adults, 1 Child' },
  { id: 'executive', name: 'Executive Suite', basePrice: 250, capacity: '3 Adults' },
  { id: 'family', name: 'Family Suite', basePrice: 320, capacity: '4 Adults, 2 Children' },
  { id: 'presidential', name: 'Presidential Suite', basePrice: 500, capacity: '4 Adults, 2 Children' },
];

export const PAYMENT_METHODS = [
  { id: 'Cash', name: 'Cash' },
  { id: 'Card', name: 'Credit / Debit Card' },
  { id: 'UPI', name: 'UPI / Online' },
  { id: 'Net Banking', name: 'Net Banking' },
];

export const BOOKING_STATUSES = {
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'Checked In',
  CHECKED_OUT: 'Checked Out',
  CANCELLED: 'Cancelled',
};

export const PAYMENT_STATUSES = {
  PAID: 'Paid',
  PARTIAL: 'Partial',
  PENDING: 'Pending',
};

export const ID_PROOF_TYPES = [
  'Aadhar Card',
  'Passport',
  'Driving License',
  'Voter ID Card',
  'National ID',
];

export const ADMIN_ROLES = [
  { id: 'super_admin', name: 'Super Admin' },
  { id: 'manager', name: 'Manager' },
  { id: 'receptionist', name: 'Receptionist' },
  { id: 'accountant', name: 'Accountant' },
];

export const PERMISSIONS_LIST = [
  { id: 'manage_bookings', label: 'Create & Manage Bookings' },
  { id: 'view_reports', label: 'View & Export Reports' },
  { id: 'view_analytics', label: 'View Revenue & Analytics' },
  { id: 'manage_admins', label: 'Manage Staff Admins' },
  { id: 'manage_settings', label: 'Configure System Settings' },
];
