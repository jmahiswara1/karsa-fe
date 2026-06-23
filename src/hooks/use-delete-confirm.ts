'use client';

import { useDialogStore } from '@/store/dialog.store';
import { toast } from 'sonner';

interface ConfirmDeleteOptions {
  title: string;
  description: string;
  confirmText: string;
  onSuccess?: () => void;
}

interface UseDeleteConfirmResult {
  /**
   * Shows a confirmation dialog and, on confirm, runs the async delete action.
   * Toasts success/error based on the promise outcome.
   */
  confirmDelete: (action: () => Promise<void>, options: ConfirmDeleteOptions) => void;
}

/**
 * Wraps the global confirm dialog + success/error toast pattern
 * used across notes, projects, and project detail pages.
 */
export function useDeleteConfirm(): UseDeleteConfirmResult {
  const { showConfirm } = useDialogStore();

  const confirmDelete = (
    action: () => Promise<void>,
    { title, description, confirmText, onSuccess }: ConfirmDeleteOptions,
  ) => {
    showConfirm({
      title,
      description,
      confirmText,
      onConfirm: async () => {
        try {
          await action();
          if (onSuccess) onSuccess();
        } catch {
          toast.error('Failed to delete');
        }
      },
    });
  };

  return { confirmDelete };
}
