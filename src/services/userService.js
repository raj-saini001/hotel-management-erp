import { delay } from './api';
import { getStorageItem, setStorageItem } from './mockData';
import { activityService } from './activityService';

export const userService = {
  getAllAdmins: async () => {
    await delay(300);
    return getStorageItem('hotel_admins', []);
  },

  createAdmin: async (adminData) => {
    await delay(400);
    const admins = getStorageItem('hotel_admins', []);
    const newAdmin = {
      ...adminData,
      id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
      avatar: adminData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };
    const updated = [...admins, newAdmin];
    setStorageItem('hotel_admins', updated);

    await activityService.logActivity('Admin Created', `Added new staff admin ${newAdmin.name} (${newAdmin.role})`);
    return newAdmin;
  },

  updateAdmin: async (id, adminData) => {
    await delay(300);
    const admins = getStorageItem('hotel_admins', []);
    const index = admins.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Admin not found');

    const updated = { ...admins[index], ...adminData };
    admins[index] = updated;
    setStorageItem('hotel_admins', admins);

    await activityService.logActivity('Admin Updated', `Updated staff permissions/role for ${updated.name}`);
    return updated;
  },

  deleteAdmin: async (id) => {
    await delay(300);
    const admins = getStorageItem('hotel_admins', []);
    const target = admins.find((a) => a.id === id);
    const filtered = admins.filter((a) => a.id !== id);
    setStorageItem('hotel_admins', filtered);

    if (target) {
      await activityService.logActivity('Admin Deleted', `Removed admin account ${target.name}`);
    }
    return true;
  },
};
