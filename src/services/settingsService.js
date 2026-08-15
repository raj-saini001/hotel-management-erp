import { delay } from './api';
import { getStorageItem, setStorageItem } from './mockData';
import { HOTEL_INFO } from '../utils/constants';
import { activityService } from './activityService';

export const settingsService = {
  getSettings: async () => {
    await delay(200);
    const settings = getStorageItem('hotel_settings', HOTEL_INFO);
    
    // Normalize and return standard settings object
    return {
      hotelName: settings?.hotelName || settings?.name || HOTEL_INFO.name,
      tagline: settings?.tagline !== undefined ? settings.tagline : HOTEL_INFO.tagline,
      phone: settings?.phone || HOTEL_INFO.phone,
      email: settings?.email || HOTEL_INFO.email,
      address: settings?.address || HOTEL_INFO.address,
      gstin: settings?.gstin || HOTEL_INFO.gstin,
      invoicePrefix: settings?.invoicePrefix || HOTEL_INFO.invoicePrefix,
      taxRate: settings?.taxRate !== undefined ? Number(settings.taxRate) : HOTEL_INFO.taxRate,
      currencySymbol: settings?.currencySymbol || HOTEL_INFO.currencySymbol,
      emailAlerts: settings?.emailAlerts !== undefined ? Boolean(settings.emailAlerts) : true,
    };
  },

  updateSettings: async (settingsData) => {
    await delay(400);
    if (!settingsData) {
      throw new Error('Invalid settings data');
    }

    const existing = getStorageItem('hotel_settings', HOTEL_INFO);

    const updatedSettings = {
      ...existing,
      ...settingsData,
      name: settingsData.hotelName || existing.name || HOTEL_INFO.name,
      updatedAt: new Date().toISOString(),
    };

    setStorageItem('hotel_settings', updatedSettings);

    await activityService.logActivity(
      'Settings Saved',
      `Updated Hotel ERP System Settings (${updatedSettings.hotelName})`
    );

    return updatedSettings;
  },
};
