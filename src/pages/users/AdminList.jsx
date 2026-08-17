import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/common/Button';
import { Loader } from '../../components/common/Loader';
import { AdminTable } from '../../components/users/AdminTable';
import { AdminFormModal } from '../../components/users/AdminFormModal';
import { DeleteDialog } from '../../components/common/DeleteDialog';
import { userService } from '../../services/userService';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllAdmins();
      setAdmins(data);
    } catch (err) {
      toast.error('Failed to load admin list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenAdd = () => {
    setEditingAdmin(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleSubmitModal = async (formData) => {
    try {
      setActionLoading(true);
      if (editingAdmin) {
        await userService.updateAdmin(editingAdmin.id, formData);
        toast.success(`Updated ${formData.name}`);
      } else {
        await userService.createAdmin(formData);
        toast.success(`Created admin account for ${formData.name}`);
      }
      setIsModalOpen(false);
      await fetchAdmins();
    } catch (err) {
      toast.error(err.message || 'Error saving admin');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget || actionLoading) return;
    try {
      setActionLoading(true);
      await userService.deleteAdmin(deleteTarget.id);
      setAdmins((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      toast.success(`Deleted ${deleteTarget.name}`);
      setDeleteTarget(null);
      await fetchAdmins();
    } catch (err) {
      toast.error(err.message || 'Failed to delete admin');
    } finally {
      setActionLoading(false);
    }
  };


  if (loading && (!admins || admins.length === 0)) {
    return <Loader text="Loading staff administrators..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & User Management"
        subtitle="Control system access roles, staff permissions, and admin accounts"
        action={
          <Button variant="primary" size="md" icon={UserPlus} onClick={handleOpenAdd}>
            Add Admin Staff
          </Button>
        }
      />

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card">
        <AdminTable admins={admins} onEdit={handleOpenEdit} onDelete={(a) => setDeleteTarget(a)} />
      </div>

      <AdminFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialValues={editingAdmin}
        onSubmit={handleSubmitModal}
        loading={actionLoading}
      />

      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        title="Delete Staff Admin"
        message={`Are you sure you want to remove access for ${deleteTarget?.name}?`}
      />
    </div>
  );
};
