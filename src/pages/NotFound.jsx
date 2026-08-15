import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, AlertCircle } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-navy-950">
      <div className="p-4 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mb-4">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-6">
        The ERP dashboard page or requested resource could not be found. Please check the URL or return to the main operational dashboard.
      </p>
      <Button variant="primary" size="lg" icon={Home} onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </Button>
    </div>
  );
};
