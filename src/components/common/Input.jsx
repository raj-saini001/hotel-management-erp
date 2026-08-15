import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      endIcon: EndIcon,
      type = 'text',
      className = '',
      containerClassName = '',
      required = false,
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
          <input
            ref={ref}
            type={type}
            className={`w-full rounded-xl border bg-white dark:bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${
              Icon ? 'pl-10' : ''
            } ${EndIcon ? 'pr-10' : ''} ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-brand-500'
            } ${className}`}
            {...props}
          />
          {EndIcon && (
            <div className="absolute right-3.5 text-slate-400">
              <EndIcon className="w-4 h-4" />
            </div>
          )}
        </div>
        {error && <span className="text-xs font-medium text-rose-500">{error}</span>}
        {helperText && !error && <span className="text-xs text-slate-500">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
