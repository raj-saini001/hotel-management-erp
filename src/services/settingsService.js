import { supabase } from '../lib/supabase';
import { HOTEL_INFO } from '../utils/constants';
import { activityService } from './activityService';

export const transformSettingsFromDb = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    hotelName: row.hotel_name || HOTEL_INFO.name,
    tagline: row.tagline !== undefined && row.tagline !== null ? row.tagline : HOTEL_INFO.tagline,
    phone: row.phone !== undefined && row.phone !== null ? row.phone : HOTEL_INFO.phone,
    email: row.email !== undefined && row.email !== null ? row.email : HOTEL_INFO.email,
    address: row.address !== undefined && row.address !== null ? row.address : HOTEL_INFO.address,
    gstin: row.gstin !== undefined && row.gstin !== null ? row.gstin : HOTEL_INFO.gstin,
    invoicePrefix: row.invoice_prefix || HOTEL_INFO.invoicePrefix,
    taxRate: row.tax_rate !== undefined && row.tax_rate !== null ? Number(row.tax_rate) : HOTEL_INFO.taxRate,
    currencySymbol: row.currency_symbol || HOTEL_INFO.currencySymbol,
    emailAlerts: row.email_alerts !== undefined && row.email_alerts !== null ? Boolean(row.email_alerts) : true,
    updatedAt: row.updated_at,
  };
};

export const transformSettingsToDb = (data) => {
  return {
    hotel_name: data.hotelName?.trim() || HOTEL_INFO.name,
    tagline: data.tagline?.trim() || null,
    phone: data.phone?.trim() || null,
    email: data.email?.trim() || null,
    address: data.address?.trim() || null,
    gstin: data.gstin?.trim() || null,
    invoice_prefix: data.invoicePrefix?.trim() || 'INV-GS-',
    tax_rate: data.taxRate !== undefined ? Number(data.taxRate) : 18,
    currency_symbol: data.currencySymbol?.trim() || '$',
    email_alerts: data.emailAlerts !== undefined ? Boolean(data.emailAlerts) : true,
    updated_at: new Date().toISOString(),
  };
};

export const settingsService = {
  getSettings: async () => {
    try {
      const { data, error } = await supabase
        .from('hotel_settings')
        .select('*')
        .limit(1);

      if (error) {
        console.warn('[settingsService] Notice fetching settings:', error.message);
        return {
          hotelName: HOTEL_INFO.name,
          tagline: HOTEL_INFO.tagline,
          phone: HOTEL_INFO.phone,
          email: HOTEL_INFO.email,
          address: HOTEL_INFO.address,
          gstin: HOTEL_INFO.gstin,
          invoicePrefix: HOTEL_INFO.invoicePrefix,
          taxRate: HOTEL_INFO.taxRate,
          currencySymbol: HOTEL_INFO.currencySymbol,
          emailAlerts: true,
        };
      }

      if (!data || data.length === 0) {
        return {
          hotelName: HOTEL_INFO.name,
          tagline: HOTEL_INFO.tagline,
          phone: HOTEL_INFO.phone,
          email: HOTEL_INFO.email,
          address: HOTEL_INFO.address,
          gstin: HOTEL_INFO.gstin,
          invoicePrefix: HOTEL_INFO.invoicePrefix,
          taxRate: HOTEL_INFO.taxRate,
          currencySymbol: HOTEL_INFO.currencySymbol,
          emailAlerts: true,
        };
      }

      return transformSettingsFromDb(data[0]);
    } catch (err) {
      console.warn('[settingsService] Exception fetching settings:', err.message);
      return {
        hotelName: HOTEL_INFO.name,
        tagline: HOTEL_INFO.tagline,
        phone: HOTEL_INFO.phone,
        email: HOTEL_INFO.email,
        address: HOTEL_INFO.address,
        gstin: HOTEL_INFO.gstin,
        invoicePrefix: HOTEL_INFO.invoicePrefix,
        taxRate: HOTEL_INFO.taxRate,
        currencySymbol: HOTEL_INFO.currencySymbol,
        emailAlerts: true,
      };
    }
  },

  updateSettings: async (settingsData) => {
    if (!settingsData) {
      throw new Error('Invalid settings data');
    }

    const payload = transformSettingsToDb(settingsData);

    // 1. Fetch current authoritative row (using limit(1) to avoid coercion error)
    const { data: existingRows, error: fetchErr } = await supabase
      .from('hotel_settings')
      .select('id')
      .limit(1);

    if (fetchErr) {
      console.warn('[settingsService] Notice fetching existing ID:', fetchErr.message);
    }

    let updatedRow = null;

    if (existingRows && existingRows.length > 0) {
      const existingId = existingRows[0].id;
      const { data: updatedRows, error: updateErr } = await supabase
        .from('hotel_settings')
        .update(payload)
        .eq('id', existingId)
        .select();

      if (updateErr) {
        console.error('[settingsService] Error updating hotel settings:', updateErr);
        if (updateErr.code === '42501' || updateErr.message?.includes('violates row-level security')) {
          throw new Error('Access denied: You do not have permission to modify system settings (manage_settings permission required).');
        }
        throw new Error(updateErr.message || 'Failed to save settings. Please try again.');
      }

      if (!updatedRows || updatedRows.length === 0) {
        throw new Error('Access denied: You do not have permission to modify system settings (manage_settings permission required).');
      }

      updatedRow = updatedRows[0];
    } else {
      // No row existed, perform single insert
      const { data: insertedRows, error: insertErr } = await supabase
        .from('hotel_settings')
        .insert({ ...payload, is_singleton: true })
        .select();

      if (insertErr) {
        console.error('[settingsService] Error inserting hotel settings:', insertErr);
        if (insertErr.code === '42501' || insertErr.message?.includes('violates row-level security')) {
          throw new Error('Access denied: You do not have permission to modify system settings (manage_settings permission required).');
        }
        throw new Error(insertErr.message || 'Failed to save settings. Please try again.');
      }

      if (!insertedRows || insertedRows.length === 0) {
        throw new Error('Access denied: You do not have permission to modify system settings (manage_settings permission required).');
      }

      updatedRow = insertedRows[0];
    }


    await activityService.logActivity(
      'Settings Saved',
      `Updated Hotel ERP System Settings (${updatedRow.hotel_name})`,
      undefined,
      'settings',
      updatedRow.id
    );

    return transformSettingsFromDb(updatedRow);
  },
};


