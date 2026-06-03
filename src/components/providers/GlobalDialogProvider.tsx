'use client';

import { useDialogStore } from '@/store/dialog.store';
import { Toaster } from '@/components/ui/sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function GlobalDialogProvider({ children }: { children: React.ReactNode }) {
  const { confirmState, alertState, closeConfirm, closeAlert } = useDialogStore();

  const handleConfirmAction = () => {
    confirmState.onConfirm();
    closeConfirm();
  };

  const handleConfirmCancel = () => {
    if (confirmState.onCancel) {
      confirmState.onCancel();
    }
    closeConfirm();
  };

  const handleAlertClose = () => {
    if (alertState.onClose) {
      alertState.onClose();
    }
    closeAlert();
  };

  return (
    <>
      {children}

      {/* Toast Notification Provider */}
      <Toaster
        position="bottom-right"
        duration={2500}
        toastOptions={{
          className: 'bg-white text-gray-900 border-gray-200 shadow-xl font-sans',
          classNames: {
            success: 'text-blue-600',
            error: 'text-red-600',
            info: 'text-blue-500',
            warning: 'text-amber-500',
            title: 'font-medium',
            description: 'text-gray-500',
            icon: 'mr-2',
          },
        }}
      />

      {/* Global Confirm Dialog */}
      <AlertDialog open={confirmState.isOpen} onOpenChange={closeConfirm}>
        <AlertDialogContent className="border-gray-100 p-6 shadow-xl sm:rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              {confirmState.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-[15px] leading-relaxed text-gray-600">
              {confirmState.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-2 sm:gap-3">
            <AlertDialogCancel
              onClick={handleConfirmCancel}
              className="h-auto rounded-lg border border-gray-200 bg-white px-5 py-2.5 font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              {confirmState.cancelText || 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className="h-auto rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-blue-700"
            >
              {confirmState.confirmText || 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Global Alert Dialog */}
      <AlertDialog open={alertState.isOpen} onOpenChange={closeAlert}>
        <AlertDialogContent className="border-gray-100 p-6 shadow-xl sm:rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              {alertState.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-[15px] leading-relaxed text-gray-600">
              {alertState.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogAction
              onClick={handleAlertClose}
              className="h-auto rounded-lg bg-blue-600 px-8 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-blue-700"
            >
              {alertState.buttonText || 'OK'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
