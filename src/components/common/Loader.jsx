import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ fullPage = false, text = 'Loading data...' }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-navy-950/80 backdrop-blur-sm">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 dark:text-brand-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{text}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 gap-3 text-slate-500 dark:text-slate-400">
      <Loader2 className="w-6 h-6 animate-spin text-brand-600 dark:text-brand-400" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};
