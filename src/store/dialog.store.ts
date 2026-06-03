import { create } from 'zustand';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface AlertDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  buttonText?: string;
  onClose?: () => void;
}

interface DialogStore {
  confirmState: ConfirmDialogState;
  alertState: AlertDialogState;

  showConfirm: (options: Omit<ConfirmDialogState, 'isOpen'>) => void;
  closeConfirm: () => void;

  showAlert: (options: Omit<AlertDialogState, 'isOpen'>) => void;
  closeAlert: () => void;
}

const initialConfirmState: ConfirmDialogState = {
  isOpen: false,
  title: '',
  description: '',
  onConfirm: () => {},
};

const initialAlertState: AlertDialogState = {
  isOpen: false,
  title: '',
  description: '',
};

export const useDialogStore = create<DialogStore>((set) => ({
  confirmState: initialConfirmState,
  alertState: initialAlertState,

  showConfirm: (options) => set({ confirmState: { ...options, isOpen: true } }),
  closeConfirm: () =>
    set((state) => ({
      confirmState: { ...state.confirmState, isOpen: false },
    })),

  showAlert: (options) => set({ alertState: { ...options, isOpen: true } }),
  closeAlert: () =>
    set((state) => ({
      alertState: { ...state.alertState, isOpen: false },
    })),
}));
