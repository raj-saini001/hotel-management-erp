import React from 'react';
import { Loader2 } from 'lucide-react';

const variantClasses = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/30 focus:ring-brand-500',
  secondary: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-slate-400',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/30 focus:ring-rose-500',
  outline: 'border border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-brand-500',
  ghost: 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-400',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl gap-2.5',
  icon: 'p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) => {
  const isIconOnly = size === 'icon';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-navy-950 disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={isIconOnly ? 'w-5 h-5' : 'w-4 h-4'} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};
