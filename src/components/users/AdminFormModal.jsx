import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { adminFormSchema } from '../../utils/validationSchemas';
import { ADMIN_ROLES, PERMISSIONS_LIST } from '../../utils/constants';
import toast from 'react-hot-toast';

export const AdminFormModal = ({ isOpen, onClose, initialValues, onSubmit, loading = false }) => {
  const isEditing = !!initialValues;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'receptionist',
      password: '',
      status: 'Active',
      permissions: ['manage_bookings'],
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || '',
        email: initialValues.email || '',
        role: initialValues.role || 'receptionist',
        password: '',
        status: initialValues.status || 'Active',
        permissions: initialValues.permissions || ['manage_bookings'],
      });
    } else {
      reset({
        name: '',
        email: '',
        role: 'receptionist',
        password: '',
        status: 'Active',
        permissions: ['manage_bookings'],
      });
    }
  }, [initialValues, reset, isOpen]);

  const handleFormSubmit = (data) => {
    if (!isEditing && (!data.password || data.password.trim().length < 6)) {
      toast.error('Staff password must be at least 6 characters long');
      return;
    }
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Staff Admin' : 'Add New Staff Admin'}
      subtitle="Configure account access credentials and permission scopes"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          required
          placeholder="e.g. Sarah Connor"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email Address"
          required
          type="email"
          placeholder="e.g. sarah@grandstay.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Role"
            required
            options={ADMIN_ROLES}
            error={errors.role?.message}
            {...register('role')}
          />
          <Select
            label="Account Status"
            required
            options={['Active', 'Inactive']}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>

        <Input
          label={isEditing ? 'New Password (Leave blank to keep unchanged)' : 'Password'}
          type="password"
          required={!isEditing}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-2">
            Module Permissions <span className="text-rose-500">*</span>
          </label>
          <div className="space-y-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            {PERMISSIONS_LIST.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={p.id}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  {...register('permissions')}
                />
                <span className="font-semibold">{p.label}</span>
              </label>
            ))}
          </div>
          {errors.permissions && (
            <span className="text-xs font-medium text-rose-500 mt-1 block">
              {errors.permissions.message}
            </span>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="md" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" loading={loading}>
            {isEditing ? 'Update Admin' : 'Create Admin'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
