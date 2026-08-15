import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/common/PageHeader';
import { AdminFormModal } from '../../components/users/AdminFormModal';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export const AddAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await userService.createAdmin(formData);
      toast.success(`Created admin account for ${formData.name}`);
      navigate('/users/list');
    } catch (err) {
      toast.error(err.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title="Add New Staff Administrator"
        subtitle="Create new staff member credentials and assign permission roles"
      />
      <AdminFormModal
        isOpen={true}
        onClose={() => navigate('/users/list')}
        initialValues={null}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};
