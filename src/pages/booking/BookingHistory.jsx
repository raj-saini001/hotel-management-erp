import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { BookingTable } from '../../components/booking/BookingTable';
import { BookingFilter } from '../../components/booking/BookingFilter';
import { BookingDetailsModal } from '../../components/booking/BookingDetailsModal';
import { DeleteDialog } from '../../components/common/DeleteDialog';
import { Pagination } from '../../components/common/Pagination';
import { useBookings } from '../../hooks/useBookings';
import { useDebounce } from '../../hooks/useDebounce';
import { PlusCircle } from 'lucide-react';
import { downloadInvoicePdf } from '../../utils/invoiceGenerator';

export const BookingHistory = () => {
  const navigate = useNavigate();
  const { bookings, loading, deleteBooking } = useBookings();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 250);

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      !debouncedSearch ||
      b.customerName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      b.invoiceNo.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      b.roomNumber.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      b.mobile.includes(debouncedSearch);

    const matchesStatus = statusFilter === 'All' || b.bookingStatus === statusFilter;
    const matchesPayment = paymentFilter === 'All' || b.paymentStatus === paymentFilter;

    let matchesDate = true;
    if (startDate) matchesDate = matchesDate && (b.checkIn >= startDate || b.bookingDate >= startDate);
    if (endDate) matchesDate = matchesDate && (b.checkOut <= endDate || b.checkIn <= endDate);

    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  const totalPages = Math.ceil(filteredBookings.length / pageSize) || 1;
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleEdit = (booking) => {
    navigate('/bookings/add', { state: { booking } });
  };

  const handleDownloadPdf = (booking) => {
    navigate(`/bookings/invoice/${booking.id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteBooking(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && (!bookings || bookings.length === 0)) {
    return <Loader text="Loading booking history database..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complete Booking Audit History"
        subtitle="Manage, search, filter, and audit all guest reservations"
        action={
          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            onClick={() => navigate('/bookings/add')}
          >
            Add New Booking
          </Button>
        }
      />

      <BookingFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        paymentFilter={paymentFilter}
        onPaymentChange={setPaymentFilter}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
      />

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <BookingTable
          bookings={paginatedBookings}
          onView={handleView}
          onEdit={handleEdit}
          onDownloadPdf={handleDownloadPdf}
          onDelete={(b) => setDeleteTarget(b)}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalRecords={filteredBookings.length}
          pageSize={pageSize}
        />
      </div>

      <BookingDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        booking={selectedBooking}
        onDownloadPdf={handleDownloadPdf}
      />

      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Reservation Record"
        message={`Are you sure you want to permanently remove reservation ${deleteTarget?.invoiceNo}?`}
      />
    </div>
  );
};
