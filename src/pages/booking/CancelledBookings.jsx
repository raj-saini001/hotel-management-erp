import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { BookingTable } from '../../components/booking/BookingTable';
import { BookingDetailsModal } from '../../components/booking/BookingDetailsModal';
import { DeleteDialog } from '../../components/common/DeleteDialog';
import { SearchBar } from '../../components/common/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { useBookings } from '../../hooks/useBookings';
import { useDebounce } from '../../hooks/useDebounce';

export const CancelledBookings = () => {
  const { bookings, deleteBooking } = useBookings();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 250);

  const cancelledAll = bookings.filter((b) => b.bookingStatus === 'Cancelled');
  const filtered = cancelledAll.filter((b) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    return (
      b.customerName.toLowerCase().includes(q) ||
      b.invoiceNo.toLowerCase().includes(q) ||
      b.roomNumber.toLowerCase().includes(q) ||
      b.mobile.includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginatedBookings = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || deleteLoading) return;
    try {
      setDeleteLoading(true);
      await deleteBooking(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cancelled Reservations Log"
        subtitle="List of bookings cancelled before check-in"
        action={
          <div className="w-full sm:w-64">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search cancelled bookings..."
            />
          </div>
        }
      />
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <BookingTable
          bookings={paginatedBookings}
          onView={(b) => { setSelectedBooking(b); setIsDetailsOpen(true); }}
          onEdit={(b) => navigate('/bookings/add', { state: { booking: b } })}
          onDownloadPdf={(b) => navigate(`/bookings/invoice/${b.id}`)}
          onDelete={(b) => setDeleteTarget(b)}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalRecords={filtered.length}
          pageSize={pageSize}
        />
      </div>

      <BookingDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        booking={selectedBooking}
        onDownloadPdf={(b) => navigate(`/bookings/invoice/${b.id}`)}
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
