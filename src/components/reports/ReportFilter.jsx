import React from 'react';
import { Download, FileSpreadsheet, Calendar } from 'lucide-react';
import { Select } from '../common/Select';
import { DatePicker } from '../common/DatePicker';
import { Button } from '../common/Button';

export const ReportFilter = ({
  reportType,
  onTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onExportPdf,
  onExportCsv,
}) => {
  const typeOptions = [
    { id: 'daily', name: 'Daily Report' },
    { id: 'monthly', name: 'Monthly Report' },
    { id: 'yearly', name: 'Yearly Report' },
    { id: 'custom', name: 'Custom Date Range' },
  ];

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
        <div className="w-full sm:w-48">
          <Select
            options={typeOptions}
            value={reportType}
            onChange={(e) => onTypeChange(e.target.value)}
            placeholder=""
          />
        </div>

        {reportType === 'custom' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <DatePicker
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              placeholder="Start Date"
            />
            <DatePicker
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              placeholder="End Date"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        <Button variant="outline" size="md" icon={FileSpreadsheet} onClick={onExportCsv}>
          Export Excel (CSV)
        </Button>
        <Button variant="primary" size="md" icon={Download} onClick={onExportPdf}>
          Export Report PDF
        </Button>
      </div>
    </div>
  );
};
