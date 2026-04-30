'use client';
// components/admin/ConfirmDialog.tsx
// Wraps Modal.js for a yes/no confirmation flow.
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={open}
      onClose={onCancel}
      title={title}
      size="sm"
      closeOnOverlayClick={!loading}
    >
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
          Annuler
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onConfirm}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        >
          {loading ? 'Suppression...' : 'Supprimer'}
        </Button>
      </div>
    </Modal>
  );
}
