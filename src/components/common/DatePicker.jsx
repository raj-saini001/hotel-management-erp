import React, { forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { Input } from './Input';

export const DatePicker = forwardRef(({ label, error, ...props }, ref) => {
  return <Input ref={ref} type="date" label={label} error={error} icon={Calendar} {...props} />;
});

DatePicker.displayName = 'DatePicker';
