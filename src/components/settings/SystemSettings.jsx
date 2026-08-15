import React from 'react';
import { Sliders, Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../common/Button';

export const SystemSettings = ({ register }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
          System Preferences & Notifications
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Active Color Theme</p>
            <p className="text-xs text-slate-500 mt-0.5">Toggle between light and dark glass mode</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={toggleTheme} icon={theme === 'dark' ? Sun : Moon}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Email & In-App Alerts</p>
            <p className="text-xs text-slate-500 mt-0.5">Receive immediate notifications on check-ins</p>
          </div>
          <input
            type="checkbox"
            {...(register ? register('emailAlerts') : { defaultChecked: true })}
            className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
