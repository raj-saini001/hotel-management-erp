import React from 'react';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';
import { formatDateTime } from '../../utils/dateFormatter';
import { Activity, Shield, Terminal } from 'lucide-react';

export const ActivityTable = ({ logs = [] }) => {
  const headers = ['Timestamp', 'Staff Admin', 'Action Performed', 'Event Details', 'IP Address'];

  const getActionVariant = (action) => {
    if (action.includes('Added') || action.includes('Created')) return 'emerald';
    if (action.includes('Updated') || action.includes('Saved')) return 'amber';
    if (action.includes('Deleted')) return 'rose';
    if (action.includes('Login')) return 'blue';
    return 'slate';
  };

  return (
    <Table headers={headers}>
      {logs.map((log) => (
        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
          <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">
            {formatDateTime(log.timestamp)}
          </td>
          <td className="px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{log.adminName}</span>
            </div>
          </td>
          <td className="px-5 py-3.5">
            <Badge variant={getActionVariant(log.action)}>{log.action}</Badge>
          </td>
          <td className="px-5 py-3.5 text-xs text-slate-700 dark:text-slate-300 max-w-sm">
            {log.details}
          </td>
          <td className="px-5 py-3.5 text-xs font-mono text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Terminal className="w-3 h-3 text-slate-400" /> {log.ipAddress}
            </span>
          </td>
        </tr>
      ))}
    </Table>
  );
};
