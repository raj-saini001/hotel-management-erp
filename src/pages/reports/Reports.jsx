import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { ReportFilter } from '../../components/reports/ReportFilter';
import { ReportSummaryCards } from '../../components/reports/ReportSummaryCards';
import { ReportTable } from '../../components/reports/ReportTable';
import { reportService } from '../../services/reportService';
import { exportToCsv } from '../../utils/helpers';
import { downloadInvoicePdf } from '../../utils/invoiceGenerator';
import toast from 'react-hot-toast';

export const Reports = () => {
  const [reportType, setReportType] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await reportService.getReportData({ type: reportType, startDate, endDate });
        setReportData(data);
      } catch (err) {
        toast.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportType, startDate, endDate]);

  const handleExportCsv = () => {
    if (!reportData?.bookings?.length) return;
    const headers = ['invoiceNo', 'customerName', 'roomNumber', 'roomType', 'checkIn', 'checkOut', 'totalAmount', 'advanceAmount', 'bookingStatus'];
    exportToCsv(`hotel_report_${reportType}`, reportData.bookings, headers);
    toast.success('CSV Report downloaded');
  };

  const handleExportPdf = () => {
    downloadInvoicePdf('report-container-card', `hotel_report_${reportType}.pdf`);
    toast.success('PDF Report downloaded');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial & Operations Reports"
        subtitle="Daily, monthly, yearly, and custom date range revenue statements"
      />

      <ReportFilter
        reportType={reportType}
        onTypeChange={setReportType}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onExportPdf={handleExportPdf}
        onExportCsv={handleExportCsv}
      />

      <div id="report-container-card" className="space-y-6">
        <ReportSummaryCards data={reportData} />
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
          <ReportTable bookings={reportData?.bookings || []} />
        </div>
      </div>
    </div>
  );
};
