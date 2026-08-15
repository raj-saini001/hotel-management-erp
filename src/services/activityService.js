import { delay } from './api';
import { getStorageItem, setStorageItem } from './mockData';

export const activityService = {
  getActivityLogs: async () => {
    await delay(200);
    const logs = getStorageItem('hotel_activity_logs', []);
    return [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  logActivity: async (action, details, adminName = 'Vijay Shree (Admin)') => {
    const logs = getStorageItem('hotel_activity_logs', []);
    const newLog = {
      id: `ACT-${Math.floor(5000 + Math.random() * 5000)}`,
      adminName,
      action,
      details,
      ipAddress: '192.168.1.105',
      timestamp: new Date().toISOString(),
    };
    const updated = [newLog, ...logs];
    setStorageItem('hotel_activity_logs', updated);
    return newLog;
  },
};
