import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { DashboardCards } from '../../components/dashboard/DashboardCards';
import { BookingChart } from '../../components/dashboard/BookingChart';
import { RevenueChart } from '../../components/dashboard/RevenueChart';
import { StatusChart } from '../../components/dashboard/StatusChart';
import { UpcomingWidget } from '../../components/dashboard/UpcomingWidget';
import { QuickActionCards } from '../../components/dashboard/QuickActionCards';
import { BookingTable } from '../../components/booking/BookingTable';
import { BookingDetailsModal } from '../../components/booking/BookingDetailsModal';
import { DeleteDialog } from '../../components/common/DeleteDialog';
import { useBookings } from '../../hooks/useBookings';
import { PlusCircle, FileText, Download } from 'lucide-react';
import { downloadInvoicePdf } from '../../utils/invoiceGenerator';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { bookings, stats, loading, deleteBooking } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleEdit = (booking) => {
    navigate('/bookings/add', { state: { booking } });
  };

  const handleDownloadPdf = (booking) => {
    downloadInvoicePdf('printable-invoice-card', `${booking.invoiceNo}.pdf`);
    navigate(`/bookings/invoice/${booking.id}`);
  };

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

  if (loading && (!bookings || bookings.length === 0)) {
    return <Loader text="Loading ERP Dashboard stats..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hotel Operations & Revenue Dashboard"
        subtitle="Real-time occupancy status, revenue statistics, and reservation management"
        action={
          <Button
            variant="primary"
            size="md"
            icon={PlusCircle}
            onClick={() => navigate('/bookings/add')}
          >
            Create New Booking
          </Button>
        }
      />

      {/* Quick Action Shortcuts */}
      <QuickActionCards />

      {/* Key Metric Statistics Cards */}
      <DashboardCards stats={stats} />

      {/* Data Visualization Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BookingChart />
          <RevenueChart />
        </div>
        <div className="space-y-6">
          <StatusChart />
          <UpcomingWidget bookings={bookings} />
        </div>
      </div>

      {/* Recent Bookings Live Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Guest Reservations</h3>
            <p className="text-xs text-slate-500">Latest 5 bookings recorded in system</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/bookings/history')}>
            View Full History →
          </Button>
        </div>

        <BookingTable
          bookings={bookings.slice(0, 5)}
          onView={handleView}
          onEdit={handleEdit}
          onDownloadPdf={handleDownloadPdf}
          onDelete={(b) => setDeleteTarget(b)}
        />
      </div>

      {/* Booking Details View Modal */}
      <BookingDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        booking={selectedBooking}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Delete Safety Dialog */}
      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Booking Record"
        message={`Are you sure you want to permanently remove reservation ${deleteTarget?.invoiceNo} (${deleteTarget?.customerName})?`}
      />
    </div>
  );
};
