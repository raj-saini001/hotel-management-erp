import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { GeneralSettings } from '../../components/settings/GeneralSettings';
import { TaxBillingSettings } from '../../components/settings/TaxBillingSettings';
import { SystemSettings } from '../../components/settings/SystemSettings';
import { hotelSettingsSchema } from '../../utils/validationSchemas';
import { useSettings } from '../../hooks/useSettings';
import { Save, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { settings, loading: fetchLoading, error: fetchError, refreshSettings, updateSettings } = useSettings();
  const [saveLoading, setSaveLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hotelSettingsSchema),
    defaultValues: settings || {
      hotelName: '',
      tagline: '',
      phone: '',
      email: '',
      address: '',
      gstin: '',
      invoicePrefix: '',
      taxRate: 18,
      currencySymbol: '$',
      emailAlerts: true,
    },
  });

  useEffect(() => {
    if (settings) {
      reset(settings);
    }
  }, [settings, reset]);

  const onSubmit = async (data) => {
    if (saveLoading) return;
    try {
      setSaveLoading(true);
      const updated = await updateSettings(data);
      reset(updated);
      toast.success('Hotel ERP settings saved successfully!');
    } catch (err) {
      console.error('Save settings error:', err);
      toast.error(err.message || 'Failed to save settings. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (fetchLoading && !settings) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <PageHeader
          title="Hotel ERP System Settings"
          subtitle="Manage property profile, GST tax rate, invoice prefixes, and system parameters"
        />
        <Loader text="Loading hotel system settings..." />
      </div>
    );
  }

  if (fetchError && !settings) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <PageHeader
          title="Hotel ERP System Settings"
          subtitle="Manage property profile, GST tax rate, invoice prefixes, and system parameters"
        />
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <div>
              <p className="font-bold text-sm">Failed to load system settings</p>
              <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">{fetchError}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={refreshSettings}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Hotel ERP System Settings"
        subtitle="Manage property profile, GST tax rate, invoice prefixes, and system parameters"
        action={
          <Button variant="primary" size="md" type="submit" loading={saveLoading} disabled={saveLoading} icon={Save}>
            Save All Changes
          </Button>
        }
      />

      <GeneralSettings register={register} errors={errors} />
      <TaxBillingSettings register={register} errors={errors} />
      <SystemSettings register={register} />
    </form>
  );
};
