import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this operation?',
  confirmLabel = 'Confirm',
  variant = 'primary',
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="outline" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={variant} size="md" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{message}</p>
        </div>
      </div>
    </Modal>
  );
};
