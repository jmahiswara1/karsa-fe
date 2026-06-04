'use client';

import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useTranslations } from 'next-intl';
import { useDialogStore } from '@/store/dialog.store';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/routing';

export function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const showConfirm = useDialogStore((state) => state.showConfirm);
  const t = useTranslations('Auth');
  const router = useRouter();

  const handleLogoutClick = () => {
    showConfirm({
      title: t('logout_confirm_title'),
      description: t('logout_confirm_desc'),
      confirmText: t('logout_confirm_yes'),
      cancelText: t('logout_confirm_no'),
      isDestructive: true,
      onConfirm: () => {
        logout();
        toast.success(t('logout_success_toast'));
        router.push('/');
      },
    });
  };

  return (
    <button
      onClick={handleLogoutClick}
      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 active:scale-95"
      title="Log out"
    >
      <LogOut className="h-4 w-4" />
    </button>
  );
}
