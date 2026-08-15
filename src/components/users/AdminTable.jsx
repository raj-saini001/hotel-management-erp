import React from 'react';
import { Table } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { RolePermissionsBadge } from './RolePermissionsBadge';
import { Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/dateFormatter';
import { PERMISSIONS_LIST } from '../../utils/constants';

export const AdminTable = ({ admins = [], onEdit, onDelete }) => {
  const headers = ['Admin User', 'Role', 'Status', 'Permissions', 'Created Date', 'Actions'];

  return (
    <Table headers={headers}>
      {admins.map((admin) => (
        <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
          <td className="px-5 py-3.5">
            <div className="flex items-center gap-3">
              <img
                src={admin.avatar}
                alt={admin.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
              />
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{admin.name}</p>
                <p className="text-[11px] text-slate-500">{admin.email}</p>
              </div>
            </div>
          </td>
          <td className="px-5 py-3.5">
            <RolePermissionsBadge role={admin.role} />
          </td>
          <td className="px-5 py-3.5">
            <Badge status={admin.status} />
          </td>
          <td className="px-5 py-3.5">
            <div className="flex flex-wrap gap-1 max-w-xs">
              {admin.permissions?.map((pId) => {
                const label = PERMISSIONS_LIST.find((p) => p.id === pId)?.label || pId;
                return (
                  <span
                    key={pId}
                    className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </td>
          <td className="px-5 py-3.5 text-xs text-slate-500">{formatDate(admin.createdAt)}</td>
          <td className="px-5 py-3.5 text-right">
            <div className="flex items-center justify-end gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(admin)} title="Edit Staff Member">
                <Edit3 className="w-4 h-4 text-slate-500 hover:text-amber-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(admin)} title="Remove Staff Member">
                <Trash2 className="w-4 h-4 text-slate-500 hover:text-rose-600" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
};
