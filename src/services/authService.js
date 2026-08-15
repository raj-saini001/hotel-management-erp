import { delay } from './api';
import { getStorageItem } from './mockData';

export const authService = {
  login: async (username, password) => {
    await delay(400);
    const admins = getStorageItem('hotel_admins', []);
    // Simple matching or default demo credentials fallback
    const user = admins.find(
      (a) => a.email.toLowerCase() === username.toLowerCase() || username.toLowerCase() === 'admin'
    ) || admins[0];

    if (!user) {
      throw new Error('Invalid username or password');
    }

    const token = `jwt-token-demo-${Date.now()}`;
    const session = { user, token };
    localStorage.setItem('hotel_admin_token', token);
    localStorage.setItem('hotel_admin_user', JSON.stringify(user));
    return session;
  },

  logout: async () => {
    await delay(200);
    localStorage.removeItem('hotel_admin_token');
    localStorage.removeItem('hotel_admin_user');
    return true;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('hotel_admin_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
