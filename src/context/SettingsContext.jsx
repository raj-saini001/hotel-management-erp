import React, { createContext, useState, useEffect, useCallback } from 'react';
import { settingsService } from '../services/settingsService';
import toast from 'react-hot-toast';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load hotel settings:', err);
      setError(err.message || 'Failed to load system settings');
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (settingsData) => {
    try {
      const updated = await settingsService.updateSettings(settingsData);
      setSettings(updated);
      return updated;
    } catch (err) {
      console.error('Failed to update hotel settings:', err);
      throw err;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings: fetchSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
