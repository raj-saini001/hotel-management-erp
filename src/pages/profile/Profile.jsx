import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Shield, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user } = useAuth();

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    toast.success('Profile details updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader title="Admin Profile & Account Settings" subtitle="View staff credentials and update security preferences" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <Card className="md:col-span-1 text-center flex flex-col items-center">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name || 'Admin'}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-500/20 mb-4"
          />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user?.name || 'Vijay Shree'}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'admin@grandstay.com'}</p>
          <div className="mt-3">
            <Badge status="Active" />
          </div>
        </Card>

        {/* Change Password & Info Form */}
        <Card className="md:col-span-2" title="Account Details" subtitle="Update personal info and password">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input label="Full Name" defaultValue={user?.name || 'Vijay Shree'} icon={User} />
            <Input label="Email Address" defaultValue={user?.email || 'admin@grandstay.com'} icon={Mail} readOnly className="bg-slate-100 dark:bg-slate-800" />
            <Input label="Current Password" type="password" placeholder="••••••••" icon={Key} />
            <Input label="New Password" type="password" placeholder="••••••••" icon={Key} />

            <div className="pt-2">
              <Button type="submit" variant="primary" size="md">
                Update Account Information
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
