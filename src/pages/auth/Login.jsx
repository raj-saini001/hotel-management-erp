import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Lock, User, KeyRound, CheckCircle2 } from 'lucide-react';
import { loginSchema } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';
import { HOTEL_INFO } from '../../utils/constants';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import toast from 'react-hot-toast';

export const Login = () => {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'admin@grandstay.com',
      password: 'admin123',
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.username, data.password);
      toast.success('Welcome to Grand Stay ERP Staff Portal!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setValue('username', 'admin@grandstay.com');
      setValue('password', 'admin123');
    } else {
      setValue('username', 'sarah.manager@grandstay.com');
      setValue('password', 'manager123');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-navy-900 to-brand-950 overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Main Glass Card */}
        <div className="p-8 rounded-3xl glass-panel border border-white/20 dark:border-slate-800 shadow-2xl space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-500/30 mb-2">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {settings?.hotelName || HOTEL_INFO.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Internal Staff ERP Portal & Administrative Portal
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username or Admin Email"
              placeholder="admin@grandstay.com"
              icon={User}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Staff Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  {...register('rememberMe')}
                />
                <span>Remember Session</span>
              </label>
              <a href="#help" onClick={(e) => { e.preventDefault(); toast.error('Please contact Super Admin for password reset.'); }} className="text-brand-600 dark:text-brand-400 hover:underline">
                Forgot Password?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full shadow-lg shadow-brand-500/30 font-bold"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 text-xs">
            <p className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-[10px]">
              Demo Accounts (One-Click Auto Fill)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-left transition-colors"
              >
                <p className="font-bold text-slate-800 dark:text-slate-200">Super Admin</p>
                <p className="text-[10px] text-slate-500">admin@grandstay.com</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('manager')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-left transition-colors"
              >
                <p className="font-bold text-slate-800 dark:text-slate-200">Manager</p>
                <p className="text-[10px] text-slate-500">sarah.manager@...</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Authorized Staff Personnel Only • Grand Stay Hotel ERP v1.0
        </p>
      </div>
    </div>
  );
};
