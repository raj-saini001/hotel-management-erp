import React from 'react';

export const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 ${className}`}>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-5 py-3.5 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900/60">
          {children}
        </tbody>
      </table>
    </div>
  );
};
