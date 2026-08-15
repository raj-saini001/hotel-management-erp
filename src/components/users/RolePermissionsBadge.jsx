import React from 'react';
import { ShieldCheck, UserCheck, Key, Shield } from 'lucide-react';
import { Badge } from '../common/Badge';

export const RolePermissionsBadge = ({ role }) => {
  const roleMaps = {
    super_admin: { label: 'Super Admin', color: 'rose', icon: ShieldCheck },
    manager: { label: 'Manager', color: 'blue', icon: Shield },
    receptionist: { label: 'Receptionist', color: 'emerald', icon: UserCheck },
    accountant: { label: 'Accountant', color: 'amber', icon: Key },
  };

  const info = roleMaps[role] || { label: role, color: 'slate', icon: Shield };
  const Icon = info.icon;

  return (
    <span className="inline-flex items-center gap-1.5 font-bold text-xs">
      <Badge variant={info.color}>
        <Icon className="w-3 h-3 inline mr-1" />
        {info.label}
      </Badge>
    </span>
  );
};
