import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords = 0,
  pageSize = 10,
}) => {
  if (totalPages <= 1) return null;

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3 text-xs text-slate-500 dark:text-slate-400">
      <div>
        Showing <span className="font-semibold text-slate-900 dark:text-slate-200">{startRecord}</span> to{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-200">{endRecord}</span> of{' '}
        <span className="font-semibold text-slate-900 dark:text-slate-200">{totalRecords}</span> entries
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          icon={ChevronLeft}
        >
          Prev
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
              pageNum === currentPage
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {pageNum}
          </button>
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          icon={ChevronRight}
          iconPosition="right"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
