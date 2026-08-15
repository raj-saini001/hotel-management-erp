import React, { forwardRef } from 'react';

export const Select = forwardRef(
  (
    {
      label,
      options = [],
      error,
      icon: Icon,
      className = '',
      containerClassName = '',
      required = false,
      placeholder = 'Select an option',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {Icon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <select
            ref={ref}
            className={`w-full appearance-none rounded-xl border bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${
              Icon ? 'pl-10' : ''
            } ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-brand-500'
            } ${className}`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => {
              const value = typeof opt === 'object' ? opt.id || opt.value : opt;
              const labelText = typeof opt === 'object' ? opt.name || opt.label : opt;
              return (
                <option key={value} value={value}>
                  {labelText}
                </option>
              );
            })}
          </select>
          <div className="absolute right-3.5 pointer-events-none text-slate-400">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <span className="text-xs font-medium text-rose-500">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
